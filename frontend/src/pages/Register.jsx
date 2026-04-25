import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/register', form)
      login(res.data.user, res.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" type="email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password"
          onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Register</button>
      </form>
      <p>Have account? <span className="link" onClick={onSwitch}>Login</span></p>
    </div>
  )
}