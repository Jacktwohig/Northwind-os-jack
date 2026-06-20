import accountsRaw from '../data/accounts.json'
import type { Account } from '../types'
import { formatDate, formatNumber } from '../lib/utils'
import { clsx } from 'clsx'

const accounts = (accountsRaw as Account[]).sort((a, b) => {
  // Active first, then by volume desc
  if (a.status !== b.status) return a.status === 'active' ? -1 : 1
  return b.monthly_volume_lbs - a.monthly_volume_lbs
})

const REGION_DOT: Record<string, string> = {
  'Pacific Northwest': 'bg-sky-400',
  'Bay Area': 'bg-violet-400',
  'Mountain West': 'bg-amber-400',
  Southwest: 'bg-red-400',
}

export default function AccountsTable() {
  const active = accounts.filter((a) => a.status === 'active').length
  const paused = accounts.filter((a) => a.status === 'paused').length
  const totalVolume = accounts
    .filter((a) => a.status === 'active')
    .reduce((s, a) => s + a.monthly_volume_lbs, 0)

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <div className="text-sm font-semibold text-slate-900">Wholesale Accounts</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {active} active · {paused} paused · {formatNumber(totalVolume)} lbs/mo active volume
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Account', 'Region', 'Monthly Volume', 'Customer Since', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {accounts.map((acct) => (
              <tr
                key={acct.id}
                className={clsx(
                  'transition-colors hover:bg-slate-50/50',
                  acct.status === 'paused' && 'opacity-50',
                )}
              >
                <td className="px-5 py-3 font-medium text-slate-900">{acct.name}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span
                      className={clsx(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        REGION_DOT[acct.region] ?? 'bg-slate-400',
                      )}
                    />
                    {acct.region}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-700 font-medium">
                  {formatNumber(acct.monthly_volume_lbs)} lbs
                </td>
                <td className="px-5 py-3 text-slate-500">{formatDate(acct.customer_since)}</td>
                <td className="px-5 py-3">
                  <span
                    className={clsx(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
                      acct.status === 'active'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {acct.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
