import { useState } from 'react'
import { getRevenueByProduct } from '../lib/sales'
import { formatCurrency } from '../lib/utils'

const PRODUCT_COLORS = [
  '#16a34a',
  '#0ea5e9',
  '#8b5cf6',
  '#f59e0b',
  '#64748b',
]

const DATE_OPTIONS = [
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
]

export default function ProductMixChart() {
  const [days, setDays] = useState(90)
  const data = getRevenueByProduct(days)
  const maxRevenue = data[0]?.revenue ?? 1
  const selectedLabel = DATE_OPTIONS.find((o) => o.days === days)?.label ?? 'Last 90 days'

  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Product Mix</div>
          <div className="text-xs text-slate-400 mt-0.5">Revenue by SKU · {selectedLabel.toLowerCase()}</div>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-300 cursor-pointer"
        >
          {DATE_OPTIONS.map((o) => (
            <option key={o.days} value={o.days}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.product}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600 font-medium truncate pr-2">{item.product}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-semibold text-slate-900">
                  {formatCurrency(item.revenue, true)}
                </span>
                <span
                  className="text-xs font-semibold w-8 text-right"
                  style={{ color: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }}
                >
                  {item.pct}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.revenue / maxRevenue) * 100}%`,
                  background: PRODUCT_COLORS[i % PRODUCT_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {data[0] && data[0].pct >= 30 && (
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
          <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
          <p className="text-xs text-amber-700 leading-snug">
            <span className="font-semibold">{data[0].product}</span> accounts for {data[0].pct}% of
            revenue — concentration worth monitoring.
          </p>
        </div>
      )}
    </div>
  )
}
