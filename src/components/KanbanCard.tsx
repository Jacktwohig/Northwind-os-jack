import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { AlertCircle, GripVertical } from 'lucide-react'
import { clsx } from 'clsx'
import type { ScoredInquiry } from '../types'
import TierBadge from './TierBadge'
import StatusBadge from './StatusBadge'
import { formatNumber } from '../lib/utils'

interface KanbanCardProps {
  inquiry: ScoredInquiry
  draggable?: boolean
  isOverlay?: boolean
  onClick: (inquiry: ScoredInquiry) => void
}

export default function KanbanCard({
  inquiry,
  draggable = false,
  isOverlay = false,
  onClick,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: inquiry.id,
    disabled: !draggable,
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => !isDragging && onClick(inquiry)}
      className={clsx(
        'bg-white rounded-lg border select-none transition-all',
        isDragging && !isOverlay ? 'opacity-30 shadow-none' : '',
        isOverlay ? 'shadow-xl rotate-1 cursor-grabbing' : 'hover:shadow-card-hover cursor-pointer',
        inquiry.isOverdue
          ? 'border-l-[3px] border-l-amber-400 border-slate-200'
          : 'border-slate-200',
      )}
    >
      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start gap-2 mb-2">
          {draggable && !isOverlay && (
            <div
              {...listeners}
              {...attributes}
              className="flex-shrink-0 mt-0.5 text-slate-300 hover:text-slate-400 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={14} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 text-sm leading-tight truncate">
              {inquiry.cafe_name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 truncate">
              {inquiry.contact_name}
            </div>
          </div>
          <TierBadge tier={inquiry.tier} size="sm" />
        </div>

        {/* Volume + region */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">
            {formatNumber(inquiry.requested_volume_lbs_month)}{' '}
            <span className="font-normal text-slate-400">lbs/mo</span>
          </span>
          <StatusBadge status={inquiry.status} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
          <span className="text-xs text-slate-400">
            {inquiry.region.replace('Pacific Northwest', 'PNW')}
          </span>
          {inquiry.isOverdue ? (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <AlertCircle size={10} />
              {inquiry.daysWaiting}d waiting
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {inquiry.daysWaiting === 0 ? 'Today' : `${inquiry.daysWaiting}d ago`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
