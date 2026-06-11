import { useFinance } from '../hooks/useFinance'
import TransactionItem from './TransactionItem'

export default function TransactionList() {
  const { filteredTransactions } = useFinance()

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-gray-900 dark:text-white">Transacciones</h2>
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full px-2.5 py-1">
          {filteredTransactions.length} registros
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No hay transacciones</p>
            <p className="text-sm mt-1">Añade una nueva transacción para empezar</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <TransactionItem key={t.id} transaction={t} />
          ))
        )}
      </div>
    </div>
  )
}