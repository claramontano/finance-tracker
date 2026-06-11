import { getCategoryById } from './categories'
import { formatDate } from './formatters'

export function exportToCSV(transactions) {
  const headers = ['Fecha', 'Descripcion', 'Categoria', 'Tipo', 'Importe']
  const rows = transactions.map(t => [
    formatDate(t.date),
    t.description.replace(/;/g, ','),
    getCategoryById(t.category).label.replace(/;/g, ','),
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    t.type === 'income' ? t.amount : -t.amount,
  ])

  const csv = [headers, ...rows].map(r => r.join(';')).join('\r\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `finanzas_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}