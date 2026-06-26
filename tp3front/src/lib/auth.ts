const STORAGE_KEY = 'fin-de-mes.user'

export interface Session {
  username: string
}

const DEMO_USER = 'demo'
const DEMO_PASS = 'demo1234'

export function login(username: string, password: string): Session {
  if (username !== DEMO_USER || password !== DEMO_PASS) {
    throw new Error('Usuario o contraseña incorrectos')
  }
  const session: Session = { username }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}