import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

interface KPICardProps {
  label: string
  value: string
  subValue?: string
  trend?: number // percentage change
  trendLabel?: string
  icon?: LucideIcon
  accent?: 'default' | 'green' | 'amber' | 'red' | 'indigo'
}

export default function KPICard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  icon: Icon,
  accent = 'default',
}: KPICardProps) {
  const hasTrend = trend !== undefined

  const trendIsPositive = (trend ?? 0) > 0.5
  const trendIsNegative = (trend ?? 0) < -0.5
  const trendIsFlat = !trendIsPositive && !trendIsNegative

  const accentColors = {
    default: 'text-slate-400 bg-slate-100',
    green: 'text-brand-600 bg-brand-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-slate-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && (
          <span className={clsx('p-1.5 rounded-lg', accentColors[accent])}>
            <Icon size={14} />
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-900 leading-none">{value}</div>
        {subValue && (
          <div className="text-sm text-slate-500 mt-1 leading-snug">{subValue}</div>
        )}
      </div>

      {hasTrend && (
        <div
          className={clsx(
            'flex items-center gap-1 text-xs font-medium',
            trendIsPositive && 'text-brand-600',
            trendIsNegative && 'text-red-500',
            trendIsFlat && 'text-slate-400',
          )}
        >
          {trendIsPositive && <TrendingUp size={13} />}
          {trendIsNegative && <TrendingDown size={13} />}
          {trendIsFlat && <Minus size={13} />}
          <span>
            {trendIsPositive && '+'}
            {Math.abs(trend ?? 0).toFixed(1)}%{' '}
            <span className="text-slate-400 font-normal">{trendLabel ?? 'vs prior period'}</span>
          </span>
        </div>
      )}
    </div>
  )
}
