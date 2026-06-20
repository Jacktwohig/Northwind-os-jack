# NOTES.md

## What I prioritized and what I cut

**Prioritized:**
- First-load impression. The dashboard needed to feel like a real tool immediately — purposeful layout, real brand identity, numbers that mean something.
- Pipeline Opportunity — a forward-looking revenue estimate from open inquiries. Every other candidate will show historical sales. This is the number a sales manager actually cares about. Calculated by applying the 90-day average revenue-per-lb rate to each open inquiry's requested volume.
- Overdue flagging on the triage list. An inquiry that's been sitting as "New" for 7+ days without contact is leaking revenue. The app surfaces this proactively so nothing slips.
- Product mix visualization. The sales data has 5 SKUs. Showing which products drive the business — and flagging concentration risk when one SKU exceeds 30% — is insight that's genuinely useful.

**Cut deliberately:**
- AI-drafted reply. Would have been a nice touch but the time was better spent on polish and the written deliverables.
- Full-text search. The filter tabs (Hot / Warm / Cold) cover the real triage use case. Search is a feature for a larger dataset.
- Tests. Explicitly out of scope per the brief — and with mock data, test coverage would be testing the data, not logic.

## Triage scoring rule

Each inquiry scores across three signals, each worth 0 (cold), 1 (warm), or 2 (hot):

| Signal | Hot (2) | Warm (1) | Cold (0) |
|---|---|---|---|
| **Volume** | ≥ 200 lbs/mo | 75–199 lbs/mo | < 75 lbs/mo |
| **Urgency** | "switching", "ASAP", "opening in 6 weeks", supplier discontinued | General interest | "just exploring", "not in a rush" |
| **Channel** | Referral, Trade show | Website, Instagram | Cold inbound |

Total ≥ 4 = Hot. Total ≥ 2 = Warm. Total < 2 = Cold.

**Why this rule:** Volume is the clearest signal of actual revenue potential. Urgency separates people who need a supplier now from those window-shopping. Channel is a proxy for intent quality — a referral has already been pre-sold by someone they trust; cold inbound has not. The scoring gives each signal equal weight because none is reliably more predictive than the others without historical conversion data.

## How I'd extend this to production

1. **Real data layer** — replace static JSON with a Supabase (or similar) backend. Inquiry status mutations persist server-side, enable multi-user sync, and support audit history.
2. **User accounts + assignment** — operators should be able to assign inquiries to themselves or teammates. Adds accountability and prevents duplicate outreach.
3. **Notifications** — a daily digest or Slack webhook for overdue inquiries so operators don't have to remember to check.
4. **Conversion tracking** — link closed/won inquiries back to accounts. Over time, this builds actual conversion rate data per channel and region, which would replace the rough revenue estimate with real numbers.
5. **CRM integration** — pipe qualified leads directly to HubSpot or similar so there's no manual handoff.

## How I built it

Built entirely with Claude Code (Claude Sonnet 4.6) as the coding agent — I directed the architecture, made design decisions, reviewed output, and iterated on polish. The workflow was:

1. **Scoped the build** — read the brief, explored the data, identified the three additions that would differentiate the submission (pipeline opportunity, overdue urgency system, product mix chart).
2. **Planned before coding** — produced a full 7-phase build plan covering every file before writing a line, so the entire codebase could be built in one coherent pass rather than patch-by-patch.
3. **Parallel execution** — wrote foundation files (types, lib helpers, context) simultaneously, then component files in batches, minimizing round-trips.
4. **Iterated on polish** — after the initial build, reviewed the running app and refined spacing, empty states, the scoring legend, and the pipeline card copy.

This is the exact workflow the role requires: orchestrate AI to ship internal tools fast, with quality, and with the judgment to know what matters.
