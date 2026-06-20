# NOTES.md

## What I prioritized and what I cut

**Prioritized:**
- First-load impression. The dashboard needed to feel like a real tool immediately — purposeful layout, real brand identity, numbers that mean something.
- Pipeline Opportunity — a forward-looking revenue estimate from open inquiries. Every other candidate will show historical sales. This is the number a sales manager actually cares about. Calculated by applying the 90-day average revenue-per-lb rate to each open inquiry's requested volume.
- Overdue flagging on the triage board. An inquiry that's been sitting as "New" for 7+ days without contact is leaking revenue. The app surfaces this proactively — orange border on the card, overdue leads sorted to the top of every column — so nothing slips.
- Kanban pipeline view for triage with two modes: Lead Score (Hot/Warm/Cold, read-only computed tiers) and Lead Stage (New/Contacted/Qualified, drag-and-drop). The two views answer different questions — Score tells you who to call first, Stage tells you where your pipeline is stalled.
- Side panel on every card — click to see full contact details, the complete message, a visual score breakdown, and contextual action buttons. Won accounts flow directly into the Dashboard accounts table without leaving the triage view.
- Product mix visualization. The sales data has 5 SKUs. Showing which products drive the business — and flagging concentration risk when one SKU exceeds 30% — is insight that's genuinely useful.
- Brand-consistent design. Forest green sidebar, matching Pipeline Opportunity card, unified color tokens throughout. The app looks like it belongs to the company, not like a generic dashboard template.

**Cut deliberately:**
- Cost/margin analysis. The sales data only includes revenue, not COGS or cost-per-lb. Fabricating cost assumptions to show a profit number would be misleading — left it out entirely.
- AI-drafted reply. Would have been a nice touch but the time was better spent on polish and the written deliverables.
- Full-text search. The filter tabs and Kanban columns cover the real triage use case. Search is a feature for a larger dataset.
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

## Triage board design decisions

**Why two views instead of one:**
Lead Score and Lead Stage answer fundamentally different questions. Score answers "who do I call today?" — it's a ranking. Stage answers "where is my pipeline stuck?" — it's a workflow. Conflating them into one view forces a compromise that serves neither use case well.

**Why Lead Score is read-only:**
Tiers are computed from the data. Letting someone drag a Cold lead into the Hot column would create a lie in the system. Score view has no drag handles — the only way to move a lead is to change the underlying facts (contact them, qualify them), which happens in Lead Stage.

**Why Won is a button, not a drag target:**
Marking a deal as Won is a consequential, one-way action — it creates an account record and removes the lead from the board. Drag-and-drop is easy to trigger accidentally. Requiring a deliberate button press inside the panel, followed by an inline confirmation, makes the action intentional and reversible up until the confirm step.

**Sort order:**
Overdue leads always surface first within any column (they represent revenue at risk), then by tier (Hot before Warm before Cold), then by volume descending within each tier.

**Won account merge:**
The browser has no writable backend, so won accounts are stored in localStorage and merged with the static accounts JSON at render time. The Dashboard's Active Accounts KPI and the Accounts table both update immediately when a deal is marked Won.

## How I'd extend this to production

1. **Real data layer** — replace static JSON with a Supabase (or similar) backend. Inquiry status mutations persist server-side, enable multi-user sync, and support audit history.
2. **User accounts + assignment** — operators should be able to assign inquiries to themselves or teammates. Adds accountability and prevents duplicate outreach.
3. **Notifications** — a daily digest or Slack webhook for overdue inquiries so operators don't have to remember to check.
4. **Conversion tracking** — link closed/won inquiries back to accounts. Over time, this builds actual conversion rate data per channel and region, which would replace the rough revenue estimate with real numbers.
5. **CRM integration** — pipe qualified leads directly to HubSpot or similar so there's no manual handoff.
6. **Cost data** — if COGS or cost-per-lb data were available, a margin view on the dashboard would be a natural addition. Deliberately excluded here rather than fabricating numbers.

## How I built it

Built entirely with Claude Code (Claude Sonnet 4.6) as the coding agent — I directed the architecture, made design decisions, reviewed output, and iterated on polish. The workflow was:

1. **Scoped the build** — read the brief, explored the data, identified the additions that would differentiate the submission: pipeline opportunity card, overdue urgency system, product mix chart, and a full Kanban triage pipeline.
2. **Planned before coding** — produced a full build plan covering every file before writing a line, so the entire codebase could be built in one coherent pass rather than patch-by-patch.
3. **Parallel execution** — wrote foundation files (types, lib helpers, context) simultaneously, then component files in batches, minimizing round-trips.
4. **Iterated on product decisions** — the Kanban redesign came from a deliberate review of the first version. The list view worked but didn't give a pipeline picture. Identified the two-view architecture, thought through the edge cases (read-only score view, Won-by-button-only, overdue sort), and built to that spec.
5. **Iterated on polish** — refined spacing, color consistency (forest green brand system throughout), empty states, the scoring legend, drag-and-drop feel, and unified page scroll on the board.

This is the exact workflow the role requires: orchestrate AI to ship internal tools fast, with quality, and with the judgment to know what matters and what to leave out.
