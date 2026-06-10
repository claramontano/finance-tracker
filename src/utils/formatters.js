export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)

export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))

export const formatMonth = (dateStr) =>
  new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(dateStr))

export const getMonthKey = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}