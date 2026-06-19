import { FinanceProvider } from './context/FinanceContext'
import Header from './components/Header'
import Summary from './components/Summary'
import Filters from './components/Filters'
import TransactionList from './components/TransactionList'
import Charts from './components/Charts'
import BudgetTracker from './components/BudgetTracker'

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <Summary />
          <Charts />
          <BudgetTracker />
          <Filters />
          <TransactionList />
        </main>
      </div>
    </FinanceProvider>
  )
}

export default App