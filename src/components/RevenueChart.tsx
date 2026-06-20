import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { getWeeklyRevenue } from '../lib/sales'
import { formatCurrency } from '../lib/utils'

const data = getWeeklyRevenue()

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value?: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card-hover px-3 py-2">
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-slate-900">
        {formatCurrency(payload[0].value ?? 0)}
      </div>
    </div>
  )
}

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Revenue Over Time</div>
          <div className="text-xs text-slate-400 mt-0.5">Weekly · last 90 days</div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-3 h-0.5 bg-brand-500 rounded-full inline-block" />
          Weekly revenue
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
