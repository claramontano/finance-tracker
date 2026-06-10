import { createContext, useReducer, useEffect, useMemo } from 'react'
import { getMonthKey } from '../utils/formatters'

export const FinanceContext = createContext()

// Datos de ejemplo para que la app no arranque vacía
const SAMPLE_DATA = [
  { id: 1, description: 'Nómina junio', category: 'salary', type: 'income', amount: 1800, date: '2026-06-01' },
  { id: 2, description: 'Proyecto freelance', category: 'freelance', type: 'income', amount: 450, date: '2026-06-05' },
  { id: 3, description: 'Alquiler', category: 'housing', type: 'expense', amount: 650, date: '2026-06-01' },
  { id: 4, description: 'Supermercado', category: 'food', type: 'expense', amount: 120, date: '2026-06-03' },
  { id: 5, description: 'Metro mensual', category: 'transport', type: 'expense', amount: 54.60, date: '2026-06-02' },
  { id: 6, description: 'Gimnasio', category: 'health', type: 'expense', amount: 35, date: '2026-06-04' },
  { id: 7, description: 'Cine + cena', category: 'leisure', type: 'expense', amount: 45, date: '2026-06-07' },
  { id: 8, description: 'Udemy React course', category: 'education', type: 'expense', amount: 14.99, date: '2026-06-06' },
  { id: 9, description: 'Nómina mayo', category: 'salary', type: 'income', amount: 1800, date: '2026-05-01' },
  { id: 10, description: 'Alquiler mayo', category: 'housing', type: 'expense', amount: 650, date: '2026-05-01' },
  { id: 11, description: 'Supermercado mayo', category: 'food', type: 'expense', amount: 98, date: '2026-05-10' },
  { id: 12, description: 'Ropa verano', category: 'clothing', type: 'expense', amount: 89, date: '2026-05-15' },
  { id: 13, description: 'Nómina abril', category: 'salary', type: 'income', amount: 1800, date: '2026-04-01' },
  { id: 14, description: 'Alquiler abril', category: 'housing', type: 'expense', amount: 650, date: '2026-04-01' },
  { id: 15, description: 'iPhone case', category: 'tech', type: 'expense', amount: 29, date: '2026-04-20' },
]

// Presupuestos por defecto por categoría
const DEFAULT_BUDGETS = {
  housing: 700,
  food: 200,
  transport: 100,
  health: 80,
  leisure: 100,
  education: 50,
  clothing: 100,
  tech: 100,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [{ ...action.payload, id: Date.now() }, ...state.transactions]
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      }
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        )
      }
    case 'SET_FILTER_MONTH':
      return { ...state, filterMonth: action.payload }
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload }
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.category]: action.payload.amount }
      }
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    default:
      return state
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem('finance-tracker-state')
    if (saved) return JSON.parse(saved)
  } catch { }
  return null
}

const initialState = loadState() || {
  transactions: SAMPLE_DATA,
  filterMonth: getMonthKey(new Date().toISOString()),
  filterCategory: 'all',
  search: '',
  budgets: DEFAULT_BUDGETS,
  darkMode: true,
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('finance-tracker-state', JSON.stringify(state))
  }, [state])

  // Aplicar modo oscuro al html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  // Transacciones filtradas (memoizadas para rendimiento)
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      const matchMonth = !state.filterMonth || getMonthKey(t.date) === state.filterMonth
      const matchCategory = state.filterCategory === 'all' || t.category === state.filterCategory
      const matchSearch = !state.search || t.description.toLowerCase().includes(state.search.toLowerCase())
      return matchMonth && matchCategory && matchSearch
    })
  }, [state.transactions, state.filterMonth, state.filterCategory, state.search])

  // Totales del mes filtrado
  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const balance = income - expense
    const savings = income > 0 ? Math.round((balance / income) * 100) : 0
    return { income, expense, balance, savings }
  }, [filteredTransactions])

  // Balance total histórico
  const totalBalance = useMemo(() => {
    return state.transactions.reduce((s, t) =>
      t.type === 'income' ? s + t.amount : s - t.amount, 0
    )
  }, [state.transactions])

  const value = {
    ...state,
    dispatch,
    filteredTransactions,
    totals,
    totalBalance,
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}