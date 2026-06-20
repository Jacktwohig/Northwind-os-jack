import { useState } from 'react'
import { AlertTriangle, Inbox } from 'lucide-react'
import { clsx } from 'clsx'
import { useTriageContext } from '../store/TriageContext'
import FilterTabs from '../components/FilterTabs'
import InquiryRow from '../components/InquiryRow'
import type { Tier } from '../types'

type FilterValue = 'all' | Tier

export default function Triage() {
  const { sortedInquiries, overdueCount } = useTriageContext()
  const [filter, setFilter] = useState<FilterValue>('all')

  const counts = {
    all: sortedInquiries.filter((i) => i.status !== 'closed').length,
    hot: sortedInquiries.filter((i) => i.tier === 'hot' && i.status !== 'closed').length,
    warm: sortedInquiries.filter((i) => i.tier === 'warm' && i.status !== 'closed').length,
    cold: sortedInquiries.filter((i) => i.tier === 'cold' && i.status !== 'closed').length,
  }

  const displayed =
    filter === 'all'
      ? sortedInquiries
      : sortedInquiries.filter((i) => i.tier === filter)

  const visibleActive = displayed.filter((i) => i.status !== 'closed')
  const visibleClosed = displayed.filter((i) => i.status === 'closed')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Inquiry Triage</h1>
        <p className="text-sm text-slate-500 mt-1">
          {sortedInquiries.length} total inquiries · scored Hot / Warm / Cold by volume, urgency &
          channel
        </p>
      </div>

      {/* Overdue alert */}
      {overdueCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {overdueCount} {overdueCount === 1 ? 'inquiry needs' : 'inquiries need'} attention
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              These leads have been sitting as "New" for 7+ days without contact. They're marked
              with an orange border below.
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-5">
        <FilterTabs active={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* Inquiry list */}
      {visibleActive.length === 0 && filter !== 'all' ? (
        <div className="text-center py-16">
          <Inbox size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">No {filter} inquiries</p>
          <p className="text-xs text-slate-400 mt-1">
            All {filter} leads have been closed or there are none yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleActive.map((inq) => (
            <InquiryRow key={inq.id} inquiry={inq} />
          ))}

          {/* Closed section */}
          {filter === 'all' && visibleClosed.length > 0 && (
            <>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Closed · {visibleClosed.length}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              {visibleClosed.map((inq) => (
                <InquiryRow key={inq.id} inquiry={inq} />
              ))}
            </>
          )}
        </div>
      )}

      {/* Scoring legend */}
      <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          How triage scoring works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              signal: 'Volume',
              hot: '≥ 200 lbs/mo',
              warm: '75–199 lbs/mo',
              cold: '< 75 lbs/mo',
            },
            {
              signal: 'Urgency',
              hot: '"Switching", "ASAP", "Opening in 6 weeks", supplier discontinued',
              warm: 'General interest, multi-location needs',
              cold: '"Just exploring", "not in a rush", early-stage',
            },
            {
              signal: 'Channel',
              hot: 'Referral, Trade show',
              warm: 'Website, Instagram',
              cold: 'Cold inbound',
            },
          ].map(({ signal, hot, warm, cold }) => (
            <div key={signal}>
              <p className="text-xs font-semibold text-slate-700 mb-2">{signal}</p>
              <div className="space-y-1.5">
                {[
                  { tier: 'Hot', desc: hot, cls: 'text-red-600' },
                  { tier: 'Warm', desc: warm, cls: 'text-amber-600' },
                  { tier: 'Cold', desc: cold, cls: 'text-indigo-600' },
                ].map(({ tier, desc, cls }) => (
                  <div key={tier} className="flex items-start gap-1.5">
                    <span className={clsx('text-xs font-semibold w-10 flex-shrink-0', cls)}>
                      {tier}
                    </span>
                    <span className="text-xs text-slate-500 leading-snug">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Each signal scores 0–2. Two or more hot signals = Hot overall. Two or more cold = Cold.
          Everything else = Warm.
        </p>
      </div>
    </div>
  )
}
