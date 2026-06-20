import { ArrowRight, Flame, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPipelineValue } from '../lib/sales'
import { formatCurrency, formatNumber } from '../lib/utils'
import { useTriageContext } from '../store/TriageContext'

const pipeline = getPipelineValue()

export default function PipelineOpportunity() {
  const { hotCount } = useTriageContext()

  return (
    <div className="bg-gradient-to-br from-brand-50 to-green-100 rounded-xl p-5 shadow-card border border-brand-100 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
            Pipeline Opportunity
          </div>
          <div className="text-xs text-brand-600/60">
            If open inquiries convert
          </div>
        </div>
        <div className="p-2 bg-brand-100 rounded-lg">
          <TrendingUp size={16} className="text-brand-600" />
        </div>
      </div>

      {/* Big number */}
      <div className="mb-5">
        <div className="text-3xl font-bold text-brand-900 leading-none mb-1">
          {formatCurrency(pipeline.estimatedMonthlyRevenue, true)}
          <span className="text-sm font-normal text-brand-600/60 ml-1">/mo</span>
        </div>
        <div className="text-xs text-brand-700/60">
          estimated from {pipeline.openCount} open inquiries ·{' '}
          {formatNumber(pipeline.totalMonthlyLbs)} lbs/mo combined
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between py-2 border-t border-brand-200/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
            <span className="text-xs text-brand-800">Qualified leads</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-brand-900">
              {formatCurrency(pipeline.qualifiedMonthlyRevenue, true)}/mo
            </span>
            <span className="text-xs text-brand-600/60 ml-1">({pipeline.qualifiedCount})</span>
          </div>
        </div>
        {hotCount > 0 && (
          <div className="flex items-center justify-between py-2 border-t border-brand-200/60">
            <div className="flex items-center gap-2">
              <Flame size={12} className="text-red-500 flex-shrink-0" />
              <span className="text-xs text-brand-800">Hot inquiries</span>
            </div>
            <span className="text-xs font-semibold text-red-600">{hotCount} need attention</span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-t border-brand-200/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-300 flex-shrink-0" />
            <span className="text-xs text-brand-800">Avg rate used</span>
          </div>
          <span className="text-xs text-brand-700/70">
            ${pipeline.avgRevenuePerLb.toFixed(2)}/lb
          </span>
        </div>
      </div>

      <Link
        to="/triage"
        className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
      >
        Work the pipeline
        <ArrowRight size={13} />
      </Link>
    </div>
  )
}
