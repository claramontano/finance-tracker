import { useFinance } from '../hooks/useFinance'
import { formatCurrency } from '../utils/formatters'

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-base font-medium">{title}</span>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className={`text-3xl font-black tracking-tight ${color}`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  )
}

export default function Summary() {
  const { totals, totalBalance } = useFinance()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Balance total"
        value={formatCurrency(totalBalance)}
        icon="💳"
        color={totalBalance >= 0 ? 'text-white' : 'text-red-400'}
        subtitle="Histórico acumulado"
      />
      <StatCard
        title="Ingresos del mes"
        value={formatCurrency(totals.income)}
        icon="📈"
        color="text-emerald-400"
        subtitle="Este período"
      />
      <StatCard
        title="Gastos del mes"
        value={formatCurrency(totals.expense)}
        icon="📉"
        color="text-red-400"
        subtitle="Este período"
      />
      <StatCard
        title="Tasa de ahorro"
        value={`${totals.savings}%`}
        icon="🏦"
        color={totals.savings >= 20 ? 'text-emerald-400' : totals.savings >= 10 ? 'text-yellow-400' : 'text-red-400'}
        subtitle={totals.savings >= 20 ? '¡Excelente!' : totals.savings >= 10 ? 'Bien' : 'Mejorable'}
      />
    </div>
  )
}