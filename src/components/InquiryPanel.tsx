import { useEffect, useState, useRef } from 'react'
import { X, Mail, CheckCircle2, Trophy, XCircle, ExternalLink, Flame, Thermometer, Snowflake, Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import { generateDraftReply } from '../lib/draftReply'
import { clsx } from 'clsx'
import type { ScoredInquiry } from '../types'
import { useTriageContext } from '../store/TriageContext'
import TierBadge from './TierBadge'
import StatusBadge from './StatusBadge'
import { formatDate, formatNumber } from '../lib/utils'
import { getTierScoreBreakdown } from '../lib/triage'

interface InquiryPanelProps {
  inquiry: ScoredInquiry | null
  onClose: () => void
}

const SCORE_LABELS: Record<number, string> = { 2: 'Strong', 1: 'Moderate', 0: 'Weak' }
const SCORE_COLORS: Record<number, string> = {
  2: 'text-brand-600',
  1: 'text-amber-600',
  0: 'text-slate-400',
}
const SCORE_DOTS = (score: number) =>
  [0, 1, 2].map((i) => (
    <span
      key={i}
      className={clsx(
        'inline-block w-2 h-2 rounded-full',
        i < score ? (score === 2 ? 'bg-brand-500' : 'bg-amber-400') : 'bg-slate-200',
      )}
    />
  ))

const TIER_ICONS = { hot: Flame, warm: Thermometer, cold: Snowflake }

export default function InquiryPanel({ inquiry, onClose }: InquiryPanelProps) {
  const { updateStatus, markAsWon } = useTriageContext()
  const [wonConfirm, setWonConfirm] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)
  const [draftLoading, setDraftLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isOpen = inquiry !== null

  // Reset all local state when inquiry changes
  useEffect(() => {
    setWonConfirm(false)
    setDraft(null)
    setDraftLoading(false)
    setCopied(false)
  }, [inquiry?.id])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!inquiry) return null

  const handleDraft = async () => {
    if (draft) { setDraft(null); return }
    setDraftLoading(true)
    const result = await generateDraftReply(inquiry)
    setDraft(result)
    setDraftLoading(false)
  }

  const handleCopy = () => {
    if (!draft) return
    navigator.clipboard.writeText(draft)
    setCopied(true)
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(false), 2000)
  }

  const score = getTierScoreBreakdown(inquiry)
  const TierIcon = TIER_ICONS[inquiry.tier]
  const isTerminal = inquiry.status === 'won' || inquiry.status === 'closed'

  const handleWon = () => {
    if (!wonConfirm) { setWonConfirm(true); return }
    markAsWon(inquiry)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-slate-900/20 z-30 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 right-0 w-[420px] bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Panel header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-bold text-slate-900 leading-tight">{inquiry.cafe_name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{inquiry.region} · {inquiry.channel}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-6">

          {/* Badges */}
          <div className="flex items-center gap-2">
            <TierBadge tier={inquiry.tier} />
            <StatusBadge status={inquiry.status} />
            {inquiry.isOverdue && (
              <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {inquiry.daysWaiting}d without contact
              </span>
            )}
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contact</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">{inquiry.contact_name}</p>
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700"
              >
                <Mail size={13} />
                {inquiry.email}
                <ExternalLink size={11} className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Inquiry details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Inquiry Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-lg font-bold text-slate-900 leading-none">
                  {formatNumber(inquiry.requested_volume_lbs_month)}
                  <span className="text-xs font-normal text-slate-400 ml-1">lbs/mo</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Requested volume</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-lg font-bold text-slate-900 leading-none">
                  {inquiry.daysWaiting === 0 ? 'Today' : `${inquiry.daysWaiting}d`}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Received {formatDate(inquiry.received_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Their Message</p>
            <blockquote className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg px-4 py-3 border-l-2 border-slate-200 italic">
              "{inquiry.message}"
            </blockquote>
          </div>

          {/* Scoring breakdown */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Lead Score</p>
            <div className="space-y-2.5">
              {[
                { label: 'Volume', value: score.volume, detail: `${formatNumber(inquiry.requested_volume_lbs_month)} lbs/mo` },
                { label: 'Urgency', value: score.urgency, detail: 'From message tone' },
                { label: 'Channel', value: score.channel, detail: inquiry.channel },
              ].map(({ label, value, detail }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TierIcon size={12} className={SCORE_COLORS[value]} />
                    <span className="text-xs text-slate-600 font-medium w-14">{label}</span>
                    <div className="flex items-center gap-0.5">{SCORE_DOTS(value)}</div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className={clsx('text-xs font-semibold', SCORE_COLORS[value])}>
                      {SCORE_LABELS[value]}
                    </span>
                    <span className="text-xs text-slate-400">{detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total score</span>
              <span className="text-xs font-bold text-slate-700">{score.total} / 6</span>
            </div>
          </div>

          {/* AI draft reply */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Draft Reply</p>
              {draft && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {copied ? <Check size={11} className="text-brand-600" /> : <Copy size={11} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {!draft && !draftLoading && (
              <button
                onClick={handleDraft}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-500 hover:text-brand-700 text-xs font-medium py-3 px-4 rounded-lg transition-all"
              >
                <Sparkles size={13} />
                Generate draft outreach email
              </button>
            )}

            {draftLoading && (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
                <Loader2 size={13} className="animate-spin" />
                Drafting email…
              </div>
            )}

            {draft && (
              <div className="relative">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={12}
                  className="w-full text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-300"
                />
                <button
                  onClick={handleDraft}
                  className="mt-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ↺ Regenerate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions footer */}
        {!isTerminal && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
            {wonConfirm ? (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-brand-800">Mark as Won?</p>
                  <p className="text-xs text-brand-700 mt-0.5">
                    This will add <strong>{inquiry.cafe_name}</strong> to your wholesale accounts at{' '}
                    {formatNumber(inquiry.requested_volume_lbs_month)} lbs/mo.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleWon}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                  >
                    <Trophy size={12} />
                    Confirm Won
                  </button>
                  <button
                    onClick={() => setWonConfirm(false)}
                    className="flex-1 text-xs font-medium text-slate-600 hover:text-slate-800 py-2 px-3 rounded-lg border border-slate-200 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {inquiry.status === 'new' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'contacted')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <Mail size={14} />
                    Mark as Contacted
                  </button>
                )}
                {inquiry.status === 'contacted' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'qualified')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Mark as Qualified
                  </button>
                )}
                {inquiry.status === 'qualified' && (
                  <button
                    onClick={handleWon}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <Trophy size={14} />
                    Mark as Won
                  </button>
                )}
                <button
                  onClick={() => { updateStatus(inquiry.id, 'closed'); onClose() }}
                  className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <XCircle size={14} />
                  Close (Lost)
                </button>
              </>
            )}
          </div>
        )}

        {/* Terminal state footer */}
        {isTerminal && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100">
            <div className={clsx(
              'flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-3',
              inquiry.status === 'won' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500',
            )}>
              {inquiry.status === 'won' ? <Trophy size={14} /> : <XCircle size={14} />}
              {inquiry.status === 'won' ? 'Marked as Won — added to accounts' : 'Closed (Lost)'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
