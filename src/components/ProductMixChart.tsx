import { getRevenueByProduct } from '../lib/sales'
import { formatCurrency } from '../lib/utils'

const data = getRevenueByProduct()

const PRODUCT_COLORS = [
  '#16a34a', // brand green
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#64748b', // slate
]

const maxRevenue = data[0]?.revenue ?? 1

export default function ProductMixChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">Product Mix</div>
        <div className="text-xs text-slate-400 mt-0.5">Revenue by SKU · 90 days</div>
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

      {/* Concentration warning */}
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
