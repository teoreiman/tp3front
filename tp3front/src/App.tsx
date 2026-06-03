import { useState } from 'react'
import { Login } from './components/Login/Login'
import { Dashboard } from './components/Login/Dashboard/Dashboard'
import { getSession, logout } from './lib/auth'
import type { Session } from './lib/auth'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(() => getSession())

  function handleLogout() {
    logout()
    setSession(null)
  }

  if (!session) {
    return <Login onLogin={setSession} />
  }

  return <Dashboard session={session} onLogout={handleLogout} />
}

export default App