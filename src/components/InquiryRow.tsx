import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { clsx } from 'clsx'
import type { ScoredInquiry } from '../types'
import { useTriageContext } from '../store/TriageContext'
import TierBadge from './TierBadge'
import StatusBadge from './StatusBadge'
import { formatNumber } from '../lib/utils'

interface InquiryRowProps {
  inquiry: ScoredInquiry
}

export default function InquiryRow({ inquiry }: InquiryRowProps) {
  const { updateStatus } = useTriageContext()
  const isClosed = inquiry.status === 'closed'

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border shadow-card transition-all',
        isClosed
          ? 'border-slate-100 opacity-50'
          : inquiry.isOverdue
          ? 'border-l-2 border-l-amber-400 border-slate-100'
          : 'border-slate-100 hover:shadow-card-hover',
      )}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          {/* Tier badge */}
          <div className="flex-shrink-0 pt-0.5">
            <TierBadge tier={inquiry.tier} />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm">{inquiry.cafe_name}</span>
              {inquiry.isOverdue && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <AlertCircle size={11} />
                  {inquiry.daysWaiting}d waiting
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {inquiry.contact_name} · {inquiry.email}
            </div>
            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
              {inquiry.message}
            </p>
          </div>

          {/* Meta */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <StatusBadge status={inquiry.status} />
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">
                {formatNumber(inquiry.requested_volume_lbs_month)}{' '}
                <span className="text-xs font-normal text-slate-400">lbs/mo</span>
              </div>
              <div className="text-xs text-slate-400">{inquiry.region}</div>
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="capitalize">{inquiry.channel}</span>
            <span>·</span>
            <span>
              {inquiry.daysWaiting === 0
                ? 'Today'
                : inquiry.daysWaiting === 1
                ? 'Yesterday'
                : `${inquiry.daysWaiting} days ago`}
            </span>
          </div>

          {!isClosed && (
            <div className="flex items-center gap-2">
              {inquiry.status !== 'contacted' && inquiry.status !== 'qualified' && (
                <button
                  onClick={() => updateStatus(inquiry.id, 'contacted')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-200 transition-colors"
                >
                  <Mail size={12} />
                  Mark Contacted
                </button>
              )}
              {inquiry.status === 'contacted' && (
                <button
                  onClick={() => updateStatus(inquiry.id, 'qualified')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                >
                  <CheckCircle2 size={12} />
                  Mark Qualified
                </button>
              )}
              <button
                onClick={() => updateStatus(inquiry.id, 'closed')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
