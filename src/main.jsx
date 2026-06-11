import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Aplicar dark mode antes de que React monte
const saved = localStorage.getItem('finance-tracker-state')
if (saved) {
  try {
    const { darkMode } = JSON.parse(saved)
    if (darkMode) document.documentElement.classList.add('dark')
  } catch { }
} else {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)