import type { Transaction, TransactionType } from '../types'

export function totalByType(txs: Transaction[], type: TransactionType): number {
  return txs
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0)
}

export function calculateBalance(txs: Transaction[]): number {
  return totalByType(txs, 'income') - totalByType(txs, 'expense')
}

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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}