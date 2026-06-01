import type { Transaction, TransactionType } from '../types'

/** Suma los montos de las transacciones de un tipo dado. */
export function totalByType(txs: Transaction[], type: TransactionType): number {
  return txs
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0)
}

/** Balance = ingresos - egresos. */
export function calculateBalance(txs: Transaction[]): number {
  return totalByType(txs, 'income') - totalByType(txs, 'expense')
}

/** Agrupa los EGRESOS sumando el total gastado por categoría. */
export function groupByCategory(txs: Transaction[]): Record<string, number> {
  return txs
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})
}

export type BudgetState = 'ok' | 'warning' | 'exceeded'

export interface BudgetStatus {
  percentage: number
  status: BudgetState
}

/**
 * Estado del presupuesto según lo gastado.
 * < 80% => ok, 80-99% => warning, >= 100% => exceeded.
 */
export function budgetStatus(spent: number, budget: number): BudgetStatus {
  if (budget <= 0) {
    return { percentage: 0, status: 'ok' }
  }
  const percentage = Math.round((spent / budget) * 100)
  let status: BudgetState = 'ok'
  if (percentage >= 100) status = 'exceeded'
  else if (percentage >= 80) status = 'warning'
  return { percentage, status }
}

/** Formatea un número como moneda (ARS). */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}