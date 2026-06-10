import { FinanceProvider } from './context/FinanceContext'
import Header from './components/Header'
import Summary from './components/Summary'
import Filters from './components/Filters'
import TransactionForm from './components/TransactionForm'

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Summary />
          <Filters />
          <TransactionForm />
        </main>
      </div>
    </FinanceProvider>
  )
}

export default App