import { useMemo } from 'react'
import { useFinance } from '../hooks/useFinance'
import { getCategoryById, getExpenseCategories } from '../utils/categories'
import { formatCurrency } from '../utils/formatters'

export default function BudgetTracker() {
  const { transactions, budgets, dispatch, filterMonth } = useFinance()

  const expensesByCategory = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && (!filterMonth || t.date.startsWith(filterMonth)))
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
  }, [transactions, filterMonth])

  const categories = getExpenseCategories()

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors duration-300">
      <h3 className="font-bold text-gray-900 dark:text-white mb-5">Presupuestos por categoría</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const spent = expensesByCategory[cat.id] || 0
          const budget = budgets[cat.id] || 0
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
          const over = budget > 0 && spent > budget
          const warning = budget > 0 && pct >= 80 && !over

          if (!budget) return null

          return (
            <div key={cat.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
                  {over && <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-full px-2 py-0.5">Superado</span>}
                  {warning && <span className="text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30 rounded-full px-2 py-0.5">¡Atención!</span>}
                </div>
                <div className="text-xs text-gray-400">
                  <span className={over ? 'text-red-500 font-bold' : 'text-gray-900 dark:text-white'}>{formatCurrency(spent)}</span>
                  <span className="text-gray-400"> / {formatCurrency(budget)}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : warning ? '#f59e0b' : cat.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <details className="mt-5">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ⚙️ Editar presupuestos
        </summary>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">{cat.icon} {cat.label}</label>
              <input
                type="number"
                value={budgets[cat.id] || ''}
                placeholder="0"
                onChange={e => dispatch({
                  type: 'SET_BUDGET',
                  payload: { category: cat.id, amount: parseFloat(e.target.value) || 0 }
                })}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}