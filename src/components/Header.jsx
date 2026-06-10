import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { exportToCSV } from '../utils/exportCSV'
import TransactionForm from './TransactionForm'

function Logo() {
  return (
    <svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" width="320" height="80">
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="60" height="60" rx="16" fill="url(#iconGrad)" opacity="0.15" />
      <rect x="4" y="10" width="60" height="60" rx="16" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5" />
      <rect x="16" y="48" width="8" height="14" rx="2" fill="url(#iconGrad)" opacity="0.5" />
      <rect x="28" y="38" width="8" height="24" rx="2" fill="url(#iconGrad)" opacity="0.75" />
      <rect x="40" y="28" width="8" height="34" rx="2" fill="url(#iconGrad)" />
      <polyline points="16,46 28,36 40,26 52,18" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="18" r="3" fill="#2dd4bf" />
      <text x="76" y="42" fontFamily="Inter,system-ui,sans-serif" fontSize="22" fontWeight="800" letterSpacing="-0.5" fill="#f8fafc">Finance</text>
      <text x="76" y="64" fontFamily="Inter,system-ui,sans-serif" fontSize="16" fontWeight="500" letterSpacing="0.5" fill="url(#textGrad)">TRACKER</text>
    </svg>
  )
}

export default function Header() {
  const { darkMode, dispatch, transactions } = useFinance()
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              <span className="text-lg leading-none">+</span> Nueva transacción
            </button>
            <button
              onClick={() => exportToCSV(transactions)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium transition-all border border-gray-700"
            >
              <span>📥</span> CSV
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-lg transition-all"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de nueva transacción */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="w-full max-w-lg">
            <TransactionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </>
  )
}