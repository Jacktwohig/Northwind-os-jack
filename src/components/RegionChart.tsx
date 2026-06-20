import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { getRevenueByRegion } from '../lib/sales'
import { formatCurrency } from '../lib/utils'

const data = getRevenueByRegion()

const REGION_COLORS: Record<string, string> = {
  'Pacific Northwest': '#0ea5e9',
  'Bay Area': '#8b5cf6',
  'Mountain West': '#f59e0b',
  Southwest: '#ef4444',
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value?: number; payload?: { region?: string } }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-card-hover px-3 py-2">
      <div className="text-xs text-slate-500 mb-0.5">{payload[0].payload?.region}</div>
      <div className="text-sm font-semibold text-slate-900">
        {formatCurrency(payload[0].value ?? 0)}
      </div>
    </div>
  )
}

export default function RegionChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">Revenue by Region</div>
        <div className="text-xs text-slate-400 mt-0.5">All 90 days</div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="region"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            width={108}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.region}
                fill={REGION_COLORS[entry.region] ?? '#16a34a'}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
        {data.map((entry) => (
          <div key={entry.region} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="w-2 h-2 rounded-sm inline-block"
              style={{ background: REGION_COLORS[entry.region] ?? '#16a34a' }}
            />
            {entry.region.replace('Pacific Northwest', 'PNW')}
          </div>
        ))}
      </div>
    </div>
  )
}
