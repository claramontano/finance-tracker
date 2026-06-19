import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import { exportToCSV } from '../utils/exportCSV'
import TransactionForm from './TransactionForm'

function Logo() {
  return (
    <svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'clamp(130px, 35vw, 240px)', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="60" height="60" rx="16" fill="url(#iconGrad)" opacity="0.15" />
      <rect x="4" y="10" width="60" height="60" rx="16" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5" />
      <rect x="16" y="48" width="8" height="14" rx="2" fill="url(#iconGrad)" opacity="0.5" />
      <rect x="28" y="38" width="8" height="24" rx="2" fill="url(#iconGrad)" opacity="0.75" />
      <rect x="40" y="28" width="8" height="34" rx="2" fill="url(#iconGrad)" />
      <polyline points="16,46 28,36 40,26 52,18" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="18" r="3" fill="#2dd4bf" />
      <text x="76" y="42" fontFamily="Inter,system-ui,sans-serif" fontSize="22" fontWeight="800" letterSpacing="-0.5" fill="currentColor">Finance</text>
      <text x="76" y="64" fontFamily="Inter,system-ui,sans-serif" fontSize="16" fontWeight="500" letterSpacing="0.5" fill="url(#textGrad)">TRACKER</text>
    </svg>
  )
}

export default function Header() {
  const { darkMode, dispatch, transactions } = useFinance()
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '1px solid rgba(31,41,55,1)',
          padding: '10px 12px',
        }}
        className="bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '8px',
          /* CLAVE: evita que los hijos desborden */
          minWidth: 0, overflow: 'hidden'
        }}>
          {/* Logo: se encoge si hay poco espacio */}
          <div style={{ flexShrink: 1, minWidth: 0, overflow: 'hidden' }}
            className="text-gray-900 dark:text-white">
            <Logo />
          </div>

          {/* Botones: nunca se encogen */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '12px',
                background: '#3b82f6', color: 'white',
                fontWeight: 700, fontSize: '14px',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
              Nueva transacción
            </button>
            <button
              onClick={() => exportToCSV(transactions)}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid rgba(55,65,81,1)',
                background: 'rgba(31,41,55,1)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
              }}
              title="Exportar CSV"
            >📥</button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid rgba(55,65,81,1)',
                background: 'rgba(31,41,55,1)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
              }}
            >{darkMode ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </header>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="w-full max-w-lg">
            <TransactionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </>
  )
}