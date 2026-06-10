import { useMemo } from 'react'
import { useFinance } from '../hooks/useFinance'
import { getCategoryById } from '../utils/categories'
import { formatCurrency } from '../utils/formatters'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
      {label && <p className="text-gray-400 text-xs mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function Charts() {
  const { transactions } = useFinance()

  // Datos para gráfica de dona (gastos por categoría)
  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const byCategory = {}
    expenses.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
    return Object.entries(byCategory)
      .map(([id, value]) => {
        const cat = getCategoryById(id)
        return { name: cat.label, value: Math.round(value * 100) / 100, color: cat.color, icon: cat.icon }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions])

  // Datos para gráfica de barras (últimos 6 meses)
  const barData = useMemo(() => {
    const months = {}
    transactions.forEach(t => {
      const key = t.date.slice(0, 7)
      if (!months[key]) months[key] = { month: key, ingresos: 0, gastos: 0 }
      if (t.type === 'income') months[key].ingresos += t.amount
      if (t.type === 'expense') months[key].gastos += t.amount
    })
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(m => ({
        ...m,
        month: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(m.month + '-01')),
        ingresos: Math.round(m.ingresos),
        gastos: Math.round(m.gastos),
      }))
  }, [transactions])

  // Datos para gráfica de área (evolución del balance)
  const areaData = useMemo(() => {
    let balance = 0
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
    const byMonth = {}
    sorted.forEach(t => {
      const key = t.date.slice(0, 7)
      balance += t.type === 'income' ? t.amount : -t.amount
      byMonth[key] = Math.round(balance)
    })
    return Object.entries(byMonth).map(([month, balance]) => ({
      month: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(new Date(month + '-01')),
      balance
    }))
  }, [transactions])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

      {/* Gráfica de dona */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="font-bold text-white mb-5">Gastos por categoría</h3>
        <div className="flex gap-4 items-center">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 flex flex-col gap-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}></span>
                  <span className="text-xs text-gray-400 truncate">{d.icon} {d.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="font-bold text-white mb-5">Ingresos vs Gastos</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
            <Bar dataKey="ingresos" fill="#34d399" radius={[4, 4, 0, 0]} name="Ingresos" />
            <Bar dataKey="gastos" fill="#f87171" radius={[4, 4, 0, 0]} name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de área — evolución balance */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 lg:col-span-2">
        <h3 className="font-bold text-white mb-5">Evolución del balance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="balance" stroke="#38bdf8" strokeWidth={2.5} fill="url(#balanceGrad)" name="Balance" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}