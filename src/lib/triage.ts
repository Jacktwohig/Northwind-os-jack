import type { Inquiry, Tier } from '../types'

// ─── Scoring weights ──────────────────────────────────────────────────────────
// Each signal returns 0 (cold), 1 (warm), or 2 (hot).
// Max total = 6. Hot ≥ 4, Warm ≥ 2, Cold < 2.

const URGENCY_HOT_KEYWORDS = [
  'switch by next month',
  'switching',
  'asap',
  'opening in 6 weeks',
  'need a replacement',
  'replacement asap',
  'quality has dropped',
  'discontinued',
  'need a reliable',
  'second location',
]

const URGENCY_COLD_KEYWORDS = [
  'just exploring',
  'not in a rush',
  'low volume to start',
  'what is your minimum',
  'want a partner who can grow',
]

const CHANNEL_HOT = new Set(['referral', 'trade show'])
const CHANNEL_COLD = new Set(['cold inbound'])

function scoreVolume(lbs: number): number {
  if (lbs >= 200) return 2
  if (lbs >= 75) return 1
  return 0
}

function scoreUrgency(message: string): number {
  const lower = message.toLowerCase()
  if (URGENCY_HOT_KEYWORDS.some((kw) => lower.includes(kw))) return 2
  if (URGENCY_COLD_KEYWORDS.some((kw) => lower.includes(kw))) return 0
  return 1
}

function scoreChannel(channel: string): number {
  if (CHANNEL_HOT.has(channel)) return 2
  if (CHANNEL_COLD.has(channel)) return 0
  return 1
}

export function getTier(inquiry: Inquiry): Tier {
  const total =
    scoreVolume(inquiry.requested_volume_lbs_month) +
    scoreUrgency(inquiry.message) +
    scoreChannel(inquiry.channel)

  if (total >= 4) return 'hot'
  if (total >= 2) return 'warm'
  return 'cold'
}

export function getTierScoreBreakdown(inquiry: Inquiry) {
  return {
    volume: scoreVolume(inquiry.requested_volume_lbs_month),
    urgency: scoreUrgency(inquiry.message),
    channel: scoreChannel(inquiry.channel),
    total:
      scoreVolume(inquiry.requested_volume_lbs_month) +
      scoreUrgency(inquiry.message) +
      scoreChannel(inquiry.channel),
  }
}

export const OVERDUE_DAYS = 7

export function getDaysWaiting(receivedDate: string): number {
  const received = new Date(receivedDate + 'T00:00:00')
  const now = new Date()
  return Math.floor((now.getTime() - received.getTime()) / (1000 * 60 * 60 * 24))
}

export function isOverdue(inquiry: Inquiry): boolean {
  return inquiry.status === 'new' && getDaysWaiting(inquiry.received_date) >= OVERDUE_DAYS
}

const TIER_ORDER: Record<Tier, number> = { hot: 0, warm: 1, cold: 2 }

export function sortInquiries(
  inquiries: (Inquiry & { tier: Tier; daysWaiting: number })[],
): (Inquiry & { tier: Tier; daysWaiting: number })[] {
  const TERMINAL = new Set(['closed', 'won'])
  return [...inquiries].sort((a, b) => {
    // Won/Closed always last
    if (TERMINAL.has(a.status) && !TERMINAL.has(b.status)) return 1
    if (TERMINAL.has(b.status) && !TERMINAL.has(a.status)) return -1
    // Then by tier
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
    if (tierDiff !== 0) return tierDiff
    // Within tier, higher volume first
    return b.requested_volume_lbs_month - a.requested_volume_lbs_month
  })
}
