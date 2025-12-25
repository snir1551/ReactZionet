import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CartProvider } from './context/CartContext'
import { Navigation, CartSidebar, ToastHost, GlobalFetchingIndicator } from './components'
import { Home, CounterPage, RegisterPage, About, ProductsPage, ProductDetailPage } from './pages'
import { useThemeStore } from './stores/themeStore'
import { useEffect } from 'react'
import './App.css'

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalFetchingIndicator />
        <Navigation />
        <CartSidebar />
        <ToastHost />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
