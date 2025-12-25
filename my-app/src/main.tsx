import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './i18n' // Initialize i18n

// PrimeReact CSS imports - load theme, core CSS, and icons
import 'primereact/resources/themes/lara-light-indigo/theme.css' // Default theme
import 'primereact/resources/primereact.min.css' // Core CSS
import 'primeicons/primeicons.css' // Icons

import './index.css'
import './styles.css'
import App from './App.tsx'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
