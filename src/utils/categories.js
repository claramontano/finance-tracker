export const CATEGORIES = [
  { id: 'salary', label: 'Salario', icon: '💼', color: '#22c55e', type: 'income' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
  { id: 'investment', label: 'Inversiones', icon: '📈', color: '#8b5cf6', type: 'income' },
  { id: 'other_income', label: 'Otros ingresos', icon: '💰', color: '#06b6d4', type: 'income' },
  { id: 'housing', label: 'Vivienda', icon: '🏠', color: '#f97316', type: 'expense' },
  { id: 'food', label: 'Alimentación', icon: '🛒', color: '#ef4444', type: 'expense' },
  { id: 'transport', label: 'Transporte', icon: '🚗', color: '#f59e0b', type: 'expense' },
  { id: 'health', label: 'Salud', icon: '❤️', color: '#ec4899', type: 'expense' },
  { id: 'leisure', label: 'Ocio', icon: '🎬', color: '#a855f7', type: 'expense' },
  { id: 'education', label: 'Formación', icon: '📚', color: '#6366f1', type: 'expense' },
  { id: 'clothing', label: 'Ropa', icon: '👗', color: '#14b8a6', type: 'expense' },
  { id: 'tech', label: 'Tecnología', icon: '📱', color: '#0ea5e9', type: 'expense' },
  { id: 'other_expense', label: 'Otros gastos', icon: '📦', color: '#94a3b8', type: 'expense' },
]

export const getCategoryById = (id) =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]

export const getIncomeCategories = () => CATEGORIES.filter(c => c.type === 'income')
export const getExpenseCategories = () => CATEGORIES.filter(c => c.type === 'expense')