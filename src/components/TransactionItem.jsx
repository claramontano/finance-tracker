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
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border border-blue-500/30">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="text" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
          <input type="number" value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
          <select value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500">
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <input type="date" value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded-lg font-medium transition-colors">Guardar</button>
          <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg transition-colors">Cancelar</button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'rgba(31,41,55,0.4)',
        borderRadius: '12px',
        border: '1px solid rgba(55,65,81,0.5)',
        padding: '12px',
        marginBottom: '0',
      }}
    >
      {/* FILA 1: icono + nombre + botones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
          backgroundColor: category.color + '20'
        }}>
          {category.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '14px', fontWeight: 600,
            color: 'white', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {transaction.description}
          </p>
          <p style={{
            fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {category.label} · {formatDate(transaction.date)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontSize: '14px',
              background: 'rgba(55,65,81,1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >✏️</button>
          <button
            onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id })}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontSize: '14px',
              background: 'rgba(55,65,81,1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}
          >🗑️</button>
        </div>
      </div>

      {/* FILA 2: importe */}
      <div style={{ marginTop: '8px', paddingLeft: '50px' }}>
        <span style={{
          fontSize: '15px', fontWeight: 900,
          color: transaction.type === 'income' ? '#34d399' : '#f87171'
        }}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  )
}