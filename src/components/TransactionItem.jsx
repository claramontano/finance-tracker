import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { getCategoryById } from '../utils/categories'
import { formatCurrency, formatDate } from '../utils/formatters'
import { getIncomeCategories, getExpenseCategories } from '../utils/categories'

export default function TransactionItem({ transaction }) {
  const { dispatch } = useFinance()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...transaction })
  const category = getCategoryById(transaction.category)
  const categories = transaction.type === 'income' ? getIncomeCategories() : getExpenseCategories()

  function handleSave() {
    dispatch({
      type: 'EDIT_TRANSACTION',
      payload: { ...form, amount: parseFloat(form.amount) }
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/30">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-base text-white outline-none focus:border-blue-500"
          />
          <input
            type="number"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-base text-white outline-none focus:border-blue-500"
          />
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-base text-white outline-none focus:border-blue-500"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-base text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-base rounded-lg font-medium transition-colors">
            Guardar
          </button>
          <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-base rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-4 bg-gray-800/40 hover:bg-gray-700/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all">

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: category.color + '20' }}
      >
        {category.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-white truncate">{transaction.description}</p>
        <p className="text-sm text-gray-500 mt-0.5">{category.label} · {formatDate(transaction.date)}</p>
      </div>

      <div className={`text-xl font-black ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => setEditing(true)}
          className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 flex items-center justify-center text-base transition-all"
        >
          ✏️
        </button>
        <button
          onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id })}
          className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-red-500/20 hover:text-red-400 text-gray-400 flex items-center justify-center text-base transition-all"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}