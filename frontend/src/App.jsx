import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import './App.css'

function AppContent() {
  const [page, setPage] = useState('home')
  const [authPage, setAuthPage] = useState('login')
  const { user, logout } = useAuth()
  const { cart } = useCart()

  const nav = (p) => setPage(p)

  return (
    <div>
      <nav className="navbar">
        <span className="brand" onClick={() => nav('home')}>🛍️ ShopDock</span>
        <div className="nav-links">
          <span onClick={() => nav('home')}>Home</span>
          {user && <span onClick={() => nav('cart')}>Cart ({cart.length})</span>}
          {user && <span onClick={() => nav('orders')}>Orders</span>}
          {user?.role === 'admin' && <span onClick={() => nav('admin')}>Admin</span>}
          {!user
            ? <span onClick={() => nav('auth')}>Login</span>
            : <span onClick={logout}>Logout ({user.name})</span>
          }
        </div>
      </nav>

      {page === 'home' && <Home />}
      {page === 'cart' && <Cart />}
      {page === 'orders' && <Orders />}
      {page === 'admin' && <Admin />}
      {page === 'auth' && (
        authPage === 'login'
          ? <Login onSwitch={() => setAuthPage('register')} />
          : <Register onSwitch={() => setAuthPage('login')} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}