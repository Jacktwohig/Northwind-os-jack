import { ArrowRight, Flame, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPipelineValue } from '../lib/sales'
import { formatCurrency, formatNumber } from '../lib/utils'
import { useTriageContext } from '../store/TriageContext'

const pipeline = getPipelineValue()

export default function PipelineOpportunity() {
  const { hotCount } = useTriageContext()

  return (
    <div className="bg-gradient-to-br from-[#021a0a] to-[#052e16] rounded-xl p-5 shadow-card border border-[#0d4a22] flex flex-col justify-between text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-green-300/70 mb-1">
            Pipeline Opportunity
          </div>
          <div className="text-xs text-green-300/50">
            If open inquiries convert
          </div>
        </div>
        <div className="p-2 bg-brand-700/30 rounded-lg">
          <TrendingUp size={16} className="text-brand-400" />
        </div>
      </div>

      {/* Big number */}
      <div className="mb-5">
        <div className="text-3xl font-bold text-white leading-none mb-1">
          {formatCurrency(pipeline.estimatedMonthlyRevenue, true)}
          <span className="text-sm font-normal text-green-300/70 ml-1">/mo</span>
        </div>
        <div className="text-xs text-green-300/70">
          estimated from {pipeline.openCount} open inquiries ·{' '}
          {formatNumber(pipeline.totalMonthlyLbs)} lbs/mo combined
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between py-2 border-t border-[#0d4a22]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
            <span className="text-xs text-green-100/80">Qualified leads</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-white">
              {formatCurrency(pipeline.qualifiedMonthlyRevenue, true)}/mo
            </span>
            <span className="text-xs text-green-300/50 ml-1">({pipeline.qualifiedCount})</span>
          </div>
        </div>
        {hotCount > 0 && (
          <div className="flex items-center justify-between py-2 border-t border-[#0d4a22]">
            <div className="flex items-center gap-2">
              <Flame size={12} className="text-red-400 flex-shrink-0" />
              <span className="text-xs text-green-100/80">Hot inquiries</span>
            </div>
            <span className="text-xs font-semibold text-red-400">{hotCount} need attention</span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-t border-[#0d4a22]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
            <span className="text-xs text-green-100/80">Avg rate used</span>
          </div>
          <span className="text-xs text-green-300/70">
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
