import { clsx } from 'clsx'
import type { Tier } from '../types'

type FilterValue = 'all' | Tier

interface TabCounts {
  all: number
  hot: number
  warm: number
  cold: number
}

interface FilterTabsProps {
  active: FilterValue
  onChange: (v: FilterValue) => void
  counts: TabCounts
}

const TABS: { value: FilterValue; label: string; activeClass: string }[] = [
  { value: 'all', label: 'All', activeClass: 'border-slate-700 text-slate-900' },
  { value: 'hot', label: 'Hot', activeClass: 'border-red-500 text-red-600' },
  { value: 'warm', label: 'Warm', activeClass: 'border-amber-500 text-amber-600' },
  { value: 'cold', label: 'Cold', activeClass: 'border-indigo-500 text-indigo-600' },
]

const COUNT_CLASS: Record<FilterValue, string> = {
  all: 'bg-slate-100 text-slate-600',
  hot: 'bg-red-50 text-red-600',
  warm: 'bg-amber-50 text-amber-600',
  cold: 'bg-indigo-50 text-indigo-600',
}

export default function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200">
      {TABS.map(({ value, label, activeClass }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
            active === value
              ? activeClass
              : 'border-transparent text-slate-500 hover:text-slate-700',
          )}
        >
          {label}
          <span
            className={clsx(
              'text-xs font-semibold px-1.5 py-0.5 rounded-full',
              active === value ? COUNT_CLASS[value] : 'bg-slate-100 text-slate-500',
            )}
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  )
}
