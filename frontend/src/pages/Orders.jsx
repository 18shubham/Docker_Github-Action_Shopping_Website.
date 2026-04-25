import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    axios.get('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data)).catch(() => {})
  }, [])

  return (
    <div className="page">
      <h2>My Orders</h2>
      {orders.length === 0 && <p className="empty">No orders yet</p>}
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.id}</span>
            <span className={`status ${order.status}`}>{order.status}</span>
            <span>${order.total}</span>
          </div>
          <div className="order-date">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}