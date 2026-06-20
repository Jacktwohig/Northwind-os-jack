import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import inquiriesRaw from '../data/inquiries.json'
import type { Inquiry, ScoredInquiry, WonAccount } from '../types'
import { getTier, getDaysWaiting, isOverdue, sortInquiries } from '../lib/triage'

interface OverrideMap {
  [id: string]: { status: Inquiry['status'] }
}

interface TriageContextValue {
  inquiries: ScoredInquiry[]
  sortedInquiries: ScoredInquiry[]
  updateStatus: (id: string, status: Inquiry['status']) => void
  markAsWon: (inquiry: ScoredInquiry) => void
  wonAccounts: WonAccount[]
  hotCount: number
  overdueCount: number
}

const TriageContext = createContext<TriageContextValue | null>(null)

const TRIAGE_KEY = 'northwind-triage-v1'
const WON_KEY = 'northwind-won-accounts-v1'

export function TriageProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>(() => {
    try { return JSON.parse(localStorage.getItem(TRIAGE_KEY) ?? '{}') as OverrideMap }
    catch { return {} }
  })

  const [wonAccounts, setWonAccounts] = useState<WonAccount[]>(() => {
    try { return JSON.parse(localStorage.getItem(WON_KEY) ?? '[]') as WonAccount[] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(TRIAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

  useEffect(() => {
    localStorage.setItem(WON_KEY, JSON.stringify(wonAccounts))
  }, [wonAccounts])

  const inquiries: ScoredInquiry[] = (inquiriesRaw as Inquiry[]).map((inq) => {
    const merged: Inquiry = { ...inq, ...(overrides[inq.id] ?? {}) }
    const daysWaiting = getDaysWaiting(merged.received_date)
    return {
      ...merged,
      tier: getTier(merged),
      daysWaiting,
      isOverdue: isOverdue(merged),
    }
  })

  const sortedInquiries = sortInquiries(inquiries) as ScoredInquiry[]

  const updateStatus = (id: string, status: Inquiry['status']) => {
    setOverrides((prev) => ({ ...prev, [id]: { status } }))
  }

  const markAsWon = (inquiry: ScoredInquiry) => {
    // Avoid duplicates
    if (wonAccounts.some((a) => a.fromInquiry === inquiry.id)) return
    const newAccount: WonAccount = {
      id: `won_${inquiry.id}`,
      name: inquiry.cafe_name,
      region: inquiry.region,
      monthly_volume_lbs: inquiry.requested_volume_lbs_month,
      customer_since: new Date().toISOString().slice(0, 10),
      status: 'active',
      fromInquiry: inquiry.id,
    }
    setWonAccounts((prev) => [...prev, newAccount])
    updateStatus(inquiry.id, 'won')
  }

  const hotCount = inquiries.filter((i) => i.tier === 'hot' && i.status !== 'closed' && i.status !== 'won').length
  const overdueCount = inquiries.filter((i) => i.isOverdue).length

  return (
    <TriageContext.Provider value={{ inquiries, sortedInquiries, updateStatus, markAsWon, wonAccounts, hotCount, overdueCount }}>
      {children}
    </TriageContext.Provider>
  )
}

export function useTriageContext() {
  const ctx = useContext(TriageContext)
  if (!ctx) throw new Error('useTriageContext must be used within TriageProvider')
  return ctx
}
