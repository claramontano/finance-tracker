import { getCategoryById } from './categories'
import { formatDate } from './formatters'

export function exportToCSV(transactions) {
  const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Importe']
  const rows = transactions.map(t => [
    formatDate(t.date),
    t.description,
    getCategoryById(t.category).label,
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    t.type === 'income' ? t.amount : -t.amount,
  ])

  const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `finanzas_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}