import { FinanceProvider } from './context/FinanceContext'

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        <h1 className="text-4xl font-bold text-blue-400 p-8">Finance Tracker</h1>
      </div>
    </FinanceProvider>
  )
}

export default App