import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//timport './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
