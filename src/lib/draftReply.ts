import type { ScoredInquiry } from '../types'

// Simulates an AI-generated outreach draft using inquiry context.
// In production this would be a call to the Anthropic API — see NOTES.md.
export async function generateDraftReply(inquiry: ScoredInquiry): Promise<string> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200))

  const { contact_name, cafe_name, requested_volume_lbs_month, channel, message } = inquiry
  const firstName = contact_name.split(' ')[0]
  const lower = message.toLowerCase()

  const isUrgent =
    lower.includes('switching') ||
    lower.includes('asap') ||
    lower.includes('opening') ||
    lower.includes('discontinued') ||
    lower.includes('replacement')

  const isReferral = channel === 'referral'
  const isTradeShow = channel === 'trade show'

  const opener = isReferral
    ? `Thanks for reaching out — always glad when a referral comes our way.`
    : isTradeShow
    ? `Great connecting at the show — glad you followed up.`
    : `Thanks for getting in touch with Northwind Coffee.`

  const volumeLine =
    requested_volume_lbs_month >= 200
      ? `${requested_volume_lbs_month} lbs/month is right in our sweet spot for wholesale partnerships, and we'd love to make this work.`
      : requested_volume_lbs_month >= 75
      ? `${requested_volume_lbs_month} lbs/month is a great starting point, and we've seen accounts like yours grow quickly once the relationship is dialed in.`
      : `We work with accounts at a range of volumes, and ${requested_volume_lbs_month} lbs/month is a solid place to start a conversation.`

  const urgencyLine = isUrgent
    ? `I saw you're looking to move quickly, so I want to make sure we get you what you need without delay.`
    : `Whenever you're ready to take the next step, we're flexible on timing.`

  return `Hi ${firstName},

${opener}

${volumeLine} ${urgencyLine}

I'd love to set up a quick call to learn more about ${cafe_name} and walk you through our current offerings — roast profiles, pricing tiers, and how our wholesale program works. We typically turn around sample orders within a week so you can taste before you commit.

Would any time this week or next work for a 20-minute call?

Looking forward to it,

[Your name]
Northwind Coffee — Wholesale Partnerships`
}
