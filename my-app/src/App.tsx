import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CartProvider } from './context/CartContext'
import { ToastHost, GlobalFetchingIndicator } from '@workspace/ui'
import { Navigation, CartSidebar } from './components'
import { Home, CounterPage, RegisterPage, About, ProductsPage, ProductDetailPage, FormPage } from './pages'
import { useThemeStore } from './stores/themeStore'
import { useToastStore } from './stores/toastStore'
import { useEffect } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import './App.css'

function App() {
  const { theme } = useThemeStore();
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const isFetching = useIsFetching();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalFetchingIndicator isFetching={isFetching > 0} />
        <Navigation />
        <CartSidebar />
        <ToastHost toasts={toasts} onRemove={removeToast} />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
