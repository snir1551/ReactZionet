import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navigation from './components/Navigation'
import GlobalFetchingIndicator from './components/GlobalFetchingIndicator'
import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <GlobalFetchingIndicator />
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  )
}

export default App
