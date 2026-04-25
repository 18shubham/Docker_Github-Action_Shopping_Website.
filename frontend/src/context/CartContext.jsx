import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { token } = useAuth()

  const headers = { Authorization: `Bearer ${token}` }

  const fetchCart = async () => {
    if (!token) return
    try {
      const res = await axios.get('/api/cart', { headers })
      setCart(res.data)
    } catch {}
  }

  const addToCart = async (product) => {
    if (!token) return alert('Please login first')
    try {
      const res = await axios.post('/api/cart/add',
        { productId: product.id, name: product.name, price: product.price, quantity: 1 },
        { headers }
      )
      setCart(res.data)
    } catch {}
  }

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${productId}`, { headers })
      setCart(res.data)
    } catch {}
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear', { headers })
      setCart([])
    } catch {}
  }

  useEffect(() => { fetchCart() }, [token])

  const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)