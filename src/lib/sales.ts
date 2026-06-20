import salesRaw from '../data/sales.json'
import inquiriesRaw from '../data/inquiries.json'
import type { Inquiry } from '../types'

interface SaleRecord {
  date: string
  region: string
  sku: string
  product: string
  units_lbs: number
  revenue: number
}

const sales = salesRaw as SaleRecord[]
const inquiries = inquiriesRaw as Inquiry[]

// Use the latest date in the data as the reference anchor so numbers
// are always consistent regardless of when the app is viewed.
function getAnchorDate(): Date {
  const latest = sales.reduce((a, b) => (a.date > b.date ? a : b)).date
  return new Date(latest + 'T00:00:00')
}

export function getTotalRevenue(): number {
  return Math.round(sales.reduce((sum, s) => sum + s.revenue, 0))
}

export function getRevenueTrend(): { last30: number; prior30: number; pctChange: number } {
  const anchor = getAnchorDate()

  const cutoff30 = new Date(anchor)
  cutoff30.setDate(cutoff30.getDate() - 30)
  const cutoff60 = new Date(anchor)
  cutoff60.setDate(cutoff60.getDate() - 60)

  const last30 = sales
    .filter((s) => new Date(s.date + 'T00:00:00') > cutoff30)
    .reduce((sum, s) => sum + s.revenue, 0)

  const prior30 = sales
    .filter((s) => {
      const d = new Date(s.date + 'T00:00:00')
      return d > cutoff60 && d <= cutoff30
    })
    .reduce((sum, s) => sum + s.revenue, 0)

  const pctChange = prior30 > 0 ? ((last30 - prior30) / prior30) * 100 : 0

  return { last30: Math.round(last30), prior30: Math.round(prior30), pctChange }
}

export function getWeeklyRevenue(): { week: string; fullDate: string; revenue: number }[] {
  const byWeek: Record<string, number> = {}

  for (const s of sales) {
    const d = new Date(s.date + 'T00:00:00')
    // Roll back to Monday of that week
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    const key = d.toISOString().slice(0, 10)
    byWeek[key] = (byWeek[key] ?? 0) + s.revenue
  }

  return Object.entries(byWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fullDate, revenue]) => ({
      fullDate,
      week: new Date(fullDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      revenue: Math.round(revenue),
    }))
}

export function getRevenueByRegion(): { region: string; revenue: number }[] {
  const byRegion: Record<string, number> = {}
  for (const s of sales) {
    byRegion[s.region] = (byRegion[s.region] ?? 0) + s.revenue
  }
  return Object.entries(byRegion)
    .sort(([, a], [, b]) => b - a)
    .map(([region, revenue]) => ({ region, revenue: Math.round(revenue) }))
}

export function getRevenueByProduct(): { product: string; revenue: number; pct: number }[] {
  const byProduct: Record<string, number> = {}
  for (const s of sales) {
    byProduct[s.product] = (byProduct[s.product] ?? 0) + s.revenue
  }
  const total = Object.values(byProduct).reduce((a, b) => a + b, 0)
  return Object.entries(byProduct)
    .sort(([, a], [, b]) => b - a)
    .map(([product, revenue]) => ({
      product,
      revenue: Math.round(revenue),
      pct: Math.round((revenue / total) * 100),
    }))
}

export function getAvgRevenuePerLb(): number {
  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0)
  const totalLbs = sales.reduce((sum, s) => sum + s.units_lbs, 0)
  return totalLbs > 0 ? totalRevenue / totalLbs : 0
}

export function getPipelineValue() {
  const avgPerLb = getAvgRevenuePerLb()
  const open = inquiries.filter((i) => i.status !== 'closed' && i.status !== 'won')
  const qualified = open.filter((i) => i.status === 'qualified')
  const totalLbs = open.reduce((sum, i) => sum + i.requested_volume_lbs_month, 0)
  const qualifiedLbs = qualified.reduce((sum, i) => sum + i.requested_volume_lbs_month, 0)

  return {
    openCount: open.length,
    qualifiedCount: qualified.length,
    totalMonthlyLbs: totalLbs,
    qualifiedMonthlyLbs: qualifiedLbs,
    estimatedMonthlyRevenue: Math.round(totalLbs * avgPerLb),
    qualifiedMonthlyRevenue: Math.round(qualifiedLbs * avgPerLb),
    avgRevenuePerLb: Math.round(avgPerLb * 100) / 100,
  }
}
