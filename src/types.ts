export interface Inquiry {
  id: string
  cafe_name: string
  contact_name: string
  email: string
  region: string
  channel: string
  requested_volume_lbs_month: number
  message: string
  received_date: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
}

export interface Account {
  id: string
  name: string
  region: string
  monthly_volume_lbs: number
  customer_since: string
  status: 'active' | 'paused'
}

export type Tier = 'hot' | 'warm' | 'cold'

export interface ScoredInquiry extends Inquiry {
  tier: Tier
  daysWaiting: number
  isOverdue: boolean
}
