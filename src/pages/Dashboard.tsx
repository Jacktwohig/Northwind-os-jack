import { DollarSign, Users, Inbox, BarChart2, TrendingUp } from 'lucide-react'
import {
  getTotalRevenue,
  getRevenueTrend,
  getPipelineValue,
} from '../lib/sales'
import accountsRaw from '../data/accounts.json'
import type { Account } from '../types'
import { formatCurrency, formatNumber, getTodayGreeting, getTodayLabel } from '../lib/utils'
import KPICard from '../components/KPICard'
import RevenueChart from '../components/RevenueChart'
import RegionChart from '../components/RegionChart'
import ProductMixChart from '../components/ProductMixChart'
import PipelineOpportunity from '../components/PipelineOpportunity'
import AccountsTable from '../components/AccountsTable'
import { useTriageContext } from '../store/TriageContext'

const totalRevenue = getTotalRevenue()
const trend = getRevenueTrend()
const pipeline = getPipelineValue()
const staticAccounts = accountsRaw as Account[]
const staticActive = staticAccounts.filter((a) => a.status === 'active').length
const staticPaused = staticAccounts.filter((a) => a.status === 'paused').length

export default function Dashboard() {
  const { wonAccounts } = useTriageContext()
  const activeAccounts = staticActive + wonAccounts.length
  const pausedAccounts = staticPaused
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          {getTodayGreeting()} · {getTodayLabel()}
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your Northwind business at a glance — last 90 days
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-7">
        <KPICard
          label="Total Revenue"
          value={formatCurrency(totalRevenue, true)}
          subValue="Last 90 days"
          icon={DollarSign}
          accent="green"
        />
        <KPICard
          label="Revenue Trend"
          value={formatCurrency(trend.last30, true)}
          subValue="Last 30 days"
          trend={trend.pctChange}
          trendLabel="vs prior 30d"
          icon={TrendingUp}
          accent={trend.pctChange >= 0 ? 'green' : 'red'}
        />
        <KPICard
          label="Active Accounts"
          value={String(activeAccounts)}
          subValue={pausedAccounts > 0 ? `${pausedAccounts} paused` : 'All accounts active'}
          icon={Users}
          accent="indigo"
        />
        <KPICard
          label="Open Inquiries"
          value={String(pipeline.openCount)}
          subValue={`${pipeline.qualifiedCount} qualified`}
          icon={Inbox}
          accent="amber"
        />
        <KPICard
          label="Pipeline Volume"
          value={`${formatNumber(pipeline.totalMonthlyLbs)} lbs`}
          subValue="Potential monthly volume"
          icon={BarChart2}
          accent="default"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-5">
        <div className="xl:col-span-3">
          <RevenueChart />
        </div>
        <div className="xl:col-span-2">
          <RegionChart />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <ProductMixChart />
        <PipelineOpportunity />
      </div>

      {/* Accounts table */}
      <AccountsTable />
    </div>
  )
}
