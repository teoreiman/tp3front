import { describe, it, expect, beforeEach } from 'vitest'
import { login, logout, getSession } from './auth'

beforeEach(() => {
  localStorage.clear()
})

describe('login', () => {
  it('devuelve la sesión y la persiste con credenciales válidas', () => {
    const session = login('demo', 'demo1234')
    expect(session).toEqual({ username: 'demo' })
    // queda persistida para recuperarla luego
    expect(getSession()).toEqual({ username: 'demo' })
  })

  it('tira error con credenciales inválidas y no persiste nada', () => {
    expect(() => login('demo', 'mal')).toThrow('Usuario o contraseña incorrectos')
    expect(getSession()).toBeNull()
  })
})

describe('getSession', () => {
  it('devuelve null si no hay sesión guardada', () => {
    expect(getSession()).toBeNull()
  })

  it('devuelve null si el dato guardado está corrupto', () => {
    localStorage.setItem('fintrack.user', '{ no es json')
    expect(getSession()).toBeNull()
  })
})

describe('logout', () => {
  it('limpia la sesión persistida', () => {
    login('demo', 'demo1234')
    logout()
    expect(getSession()).toBeNull()
  })
})
