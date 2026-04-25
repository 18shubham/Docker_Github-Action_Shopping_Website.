import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart()
  const { token } = useAuth()

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty')
    try {
      await axios.post('/api/orders',
        { items: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await clearCart()
      alert('Order placed successfully!')
    } catch (err) {
      alert(err.response?.data?.error || 'Order failed')
    }
  }

  if (cart.length === 0) return (
    <div className="page"><p className="empty">Your cart is empty</p></div>
  )

  return (
    <div className="page">
      <h2>Your Cart</h2>
      {cart.map(item => (
        <div key={item.productId} className="cart-item">
          <span>{item.name}</span>
          <span>Qty: {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeFromCart(item.productId)}>Remove</button>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
        <button className="btn-order" onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  )
}