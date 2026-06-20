import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import inquiriesRaw from '../data/inquiries.json'
import type { Inquiry, ScoredInquiry } from '../types'
import { getTier, getDaysWaiting, isOverdue, sortInquiries } from '../lib/triage'

interface OverrideMap {
  [id: string]: { status: Inquiry['status'] }
}

interface TriageContextValue {
  inquiries: ScoredInquiry[]
  sortedInquiries: ScoredInquiry[]
  updateStatus: (id: string, status: Inquiry['status']) => void
  hotCount: number
  overdueCount: number
}

const TriageContext = createContext<TriageContextValue | null>(null)
const STORAGE_KEY = 'northwind-triage-v1'

export function TriageProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<OverrideMap>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as OverrideMap
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }, [overrides])

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

  const hotCount = inquiries.filter((i) => i.tier === 'hot' && i.status !== 'closed').length
  const overdueCount = inquiries.filter((i) => i.isOverdue).length

  return (
    <TriageContext.Provider value={{ inquiries, sortedInquiries, updateStatus, hotCount, overdueCount }}>
      {children}
    </TriageContext.Provider>
  )
}

export function useTriageContext() {
  const ctx = useContext(TriageContext)
  if (!ctx) throw new Error('useTriageContext must be used within TriageProvider')
  return ctx
}
