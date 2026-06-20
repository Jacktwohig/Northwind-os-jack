import { clsx } from 'clsx'
import type { Inquiry } from '../types'

const CONFIG: Record<Inquiry['status'], { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  contacted: { label: 'Contacted', className: 'bg-violet-50 text-violet-700 border border-violet-200' },
  qualified: { label: 'Qualified', className: 'bg-brand-50 text-brand-700 border border-brand-100' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-400 border border-slate-200' },
}

export default function StatusBadge({ status }: { status: Inquiry['status'] }) {
  const { label, className } = CONFIG[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold leading-none',
        className,
      )}
    >
      {label}
    </span>
  )
}
