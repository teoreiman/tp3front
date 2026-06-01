import { useState, type FormEvent } from 'react'
import { login } from '../../lib/auth'
import type { Session } from '../../lib/auth'
import './Login.css'

interface LoginProps {
  onLogin: (session: Session) => void
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const session = login(username, password)
      setError('')
      onLogin(session)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <h1 className="login__title">💰 FinTrack</h1>
        <p className="login__subtitle">Ingresá para gestionar tus gastos</p>

        <label className="login__field">
          <span>Usuario</span>
          <input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="demo"
            autoComplete="username"
          />
        </label>

        <label className="login__field">
          <span>Contraseña</span>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}

        <button className="login__submit" type="submit">
          Ingresar
        </button>
        <p className="login__hint">
          Demo: <code>demo</code> / <code>demo1234</code>
        </p>
      </form>
    </div>
  )
}