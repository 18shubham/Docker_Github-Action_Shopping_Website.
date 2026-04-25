import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('stats')
  const [newProduct, setNewProduct] = useState({
    name:'', description:'', price:'', stock:'', category:''
  })
  const { token } = useAuth()
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get('/api/admin/stats', { headers }).then(r => setStats(r.data))
    axios.get('/api/orders/all', { headers }).then(r => setOrders(r.data))
    axios.get('/api/products').then(r => setProducts(r.data))
  }, [])

  const addProduct = async (e) => {
    e.preventDefault()
    const form = new FormData()
    Object.entries(newProduct).forEach(([k,v]) => form.append(k,v))
    const file = e.target.image?.files[0]
    if (file) form.append('image', file)
    try {
      await axios.post('/api/products', form, { headers })
      alert('Product added!')
      axios.get('/api/products').then(r => setProducts(r.data))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed')
    }
  }

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/orders/${id}/status`, { status }, { headers })
    setOrders(orders.map(o => o.id === id ? {...o, status} : o))
  }

  return (
    <div className="page admin">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        {['stats','orders','products'].map(t => (
          <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="stats-grid">
          <div className="stat-card"><h3>Users</h3><p>{stats.totalUsers}</p></div>
          <div className="stat-card"><h3>Products</h3><p>{stats.totalProducts}</p></div>
          <div className="stat-card"><h3>Orders</h3><p>{stats.totalOrders}</p></div>
          <div className="stat-card"><h3>Revenue</h3><p>${stats.totalRevenue}</p></div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.map(o => (
            <div key={o.id} className="order-card">
              <span>Order #{o.id} — {o.customer_name}</span>
              <span>${o.total}</span>
              <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <form className="product-form" onSubmit={addProduct}>
            <h3>Add Product</h3>
            {['name','description','price','stock','category'].map(f => (
              <input key={f} placeholder={f}
                onChange={e => setNewProduct({...newProduct, [f]: e.target.value})} />
            ))}
            <input type="file" name="image" accept="image/*" />
            <button type="submit">Add Product</button>
          </form>
          <div className="products-grid">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <h3>{p.name}</h3>
                <p>${p.price} — Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}