import { Flame, Thermometer, Snowflake } from 'lucide-react'
import { clsx } from 'clsx'
import type { Tier } from '../types'

interface TierBadgeProps {
  tier: Tier
  size?: 'sm' | 'md'
}

const CONFIG = {
  hot: {
    label: 'Hot',
    icon: Flame,
    className: 'bg-hot-bg text-hot-text border border-hot-border',
  },
  warm: {
    label: 'Warm',
    icon: Thermometer,
    className: 'bg-warm-bg text-warm-text border border-warm-border',
  },
  cold: {
    label: 'Cold',
    icon: Snowflake,
    className: 'bg-cold-bg text-cold-text border border-cold-border',
  },
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const { label, icon: Icon, className } = CONFIG[tier]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold rounded-full leading-none',
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1',
        className,
      )}
    >
      <Icon size={10} />
      {label}
    </span>
  )
}
