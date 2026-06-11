import { useFinance } from '../hooks/useFinance'

export default function Filters() {
  const { filterMonth, search, transactions, dispatch } = useFinance()

  const months = [...new Set(transactions.map(t => t.date.slice(0, 7)))]
    .sort((a, b) => b.localeCompare(a))

  const formatMonthLabel = (m) => {
    const [year, month] = m.split('-')
    const date = new Date(year, month - 1)
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex-1 min-w-48">
        <input
          type="text"
          placeholder="🔍 Buscar transacción..."
          value={search}
          onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <select
        value={filterMonth}
        onChange={e => dispatch({ type: 'SET_FILTER_MONTH', payload: e.target.value })}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
      >
        <option value="">Todos los meses</option>
        {months.map(m => (
          <option key={m} value={m}>{formatMonthLabel(m)}</option>
        ))}
      </select>
    </div>
  )
}