import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { addToCart } = useCart()

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?search=${search}&category=${category}`)
      setProducts(res.data)
    } catch {}
  }

  useEffect(() => { fetchProducts() }, [search, category])

  return (
    <div className="page">
      <div className="search-bar">
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home</option>
        </select>
      </div>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            {p.image_url
              ? <img src={p.image_url} alt={p.name} />
              : <div className="no-image">No Image</div>
            }
            <h3>{p.name}</h3>
            <p className="category">{p.category}</p>
            <p className="description">{p.description}</p>
            <div className="product-footer">
              <span className="price">${p.price}</span>
              <span className="stock">Stock: {p.stock}</span>
            </div>
            <button
              onClick={() => addToCart(p)}
              disabled={p.stock === 0}
              className="btn-cart"
            >
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="empty">No products found</p>}
      </div>
    </div>
  )
}