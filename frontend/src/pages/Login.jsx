import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', form)
      login(res.data.user, res.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" type="email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
      <p>No account? <span className="link" onClick={onSwitch}>Register</span></p>
    </div>
  )
}