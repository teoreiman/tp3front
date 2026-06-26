import { describe, it, expect } from 'vitest'
import {
  calculateBalance,
  totalByType,
  groupByCategory,
  budgetStatus,
  formatCurrency,
} from './finance'
import type { Transaction } from '../types'

const txs: Transaction[] = [
  { id: '1', description: 'Sueldo', amount: 1000, type: 'income', category: 'Salario', date: '2026-06-01' },
  { id: '2', description: 'Super', amount: 200, type: 'expense', category: 'Comida', date: '2026-06-02' },
  { id: '3', description: 'Bondi', amount: 50, type: 'expense', category: 'Transporte', date: '2026-06-03' },
  { id: '4', description: 'Resto', amount: 150, type: 'expense', category: 'Comida', date: '2026-06-04' },
]

describe('calculateBalance', () => {
  it('resta egresos de ingresos', () => {
    expect(calculateBalance(txs)).toBe(600)
  })

  it('devuelve 0 con una lista vacía', () => {
    expect(calculateBalance([])).toBe(0)
  })
})

describe('totalByType', () => {
  it('suma solo las transacciones del tipo pedido', () => {
    expect(totalByType(txs, 'income')).toBe(1000)
    expect(totalByType(txs, 'expense')).toBe(400)
  })
})

describe('groupByCategory', () => {
  it('agrupa egresos por categoría e ignora los ingresos', () => {
    expect(groupByCategory(txs)).toEqual({ Comida: 350, Transporte: 50 })
  })
})

describe('budgetStatus', () => {
  it('marca "ok" por debajo del 80%', () => {
    expect(budgetStatus(50, 100)).toEqual({ percentage: 50, status: 'ok' })
  })

  it('marca "warning" entre 80% y 99%', () => {
    expect(budgetStatus(80, 100).status).toBe('warning')
  })

  it('marca "exceeded" al llegar o pasar el 100%', () => {
    expect(budgetStatus(120, 100).status).toBe('exceeded')
  })

  it('no rompe si el presupuesto es 0', () => {
    expect(budgetStatus(50, 0)).toEqual({ percentage: 0, status: 'ok' })
  })
})

describe('formatCurrency', () => {
  it('formatea montos en pesos argentinos con separador de miles', () => {
    expect(formatCurrency(50000)).toContain('50.000')
  })

  it('formatea cero correctamente', () => {
    expect(formatCurrency(0)).toContain('0')
  })
})