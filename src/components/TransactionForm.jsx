import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { getIncomeCategories, getExpenseCategories } from '../utils/categories'

export default function TransactionForm() {
  const { dispatch } = useFinance()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('expense')
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().slice(0, 10),
  })

  const categories = type === 'income' ? getIncomeCategories() : getExpenseCategories()

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.description || !form.amount) return
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        ...form,
        type,
        amount: parseFloat(form.amount),
      }
    })
    setForm({ description: '', amount: '', category: type === 'income' ? 'salary' : 'food', date: new Date().toISOString().slice(0, 10) })
    setOpen(false)
  }

  function handleTypeChange(t) {
    setType(t)
    setForm(f => ({ ...f, category: t === 'income' ? 'salary' : 'food' }))
  }

  return (
    <div className="mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-700 hover:border-blue-500 text-gray-500 hover:text-blue-400 font-medium transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Nueva transacción
        </button>
      ) : (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-5">Nueva transacción</h3>

          {/* Tipo */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${type === 'expense' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
            >
              📉 Gasto
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
            >
              📈 Ingreso
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Supermercado"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Importe (€)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Categoría</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold transition-colors"
              >
                Añadir transacción
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}