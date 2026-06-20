import { useDroppable } from '@dnd-kit/core'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  dotColor: string
  headerColor: string
  children: ReactNode
  droppable?: boolean
  emptyMessage?: string
}

export default function KanbanColumn({
  id,
  title,
  count,
  dotColor,
  headerColor,
  children,
  droppable = false,
  emptyMessage = 'No leads here',
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !droppable })

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0">
      {/* Column header */}
      <div className={clsx('flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b', headerColor)}>
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', dotColor)} />
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        <span className="text-xs font-semibold bg-white/60 text-slate-500 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Droppable card list */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2 rounded-b-xl transition-colors duration-150',
          isOver ? 'bg-brand-50/70 ring-1 ring-brand-200' : 'bg-slate-50/60',
          droppable && 'min-h-[120px]',
        )}
      >
        {count === 0 ? (
          <div className="flex items-center justify-center h-16 text-xs text-slate-400 italic">
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
