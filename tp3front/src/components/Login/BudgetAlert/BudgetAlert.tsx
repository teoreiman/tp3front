import { budgetStatus, totalByType, formatCurrency } from '../../../lib/finance'
import type { Transaction } from '../../../types'

interface BudgetAlertProps {
  transactions: Transaction[]
  budget: number
}

const MESSAGES = {
  ok: 'Vas bien con tu presupuesto',
  warning: 'Cuidado: ya usaste más del 80% del presupuesto',
  exceeded: '¡Te pasaste del presupuesto!',
} as const

export function BudgetAlert({ transactions, budget }: BudgetAlertProps) {
  const spent = totalByType(transactions, 'expense')
  const { percentage, status } = budgetStatus(spent, budget)

  return (
    <section className={`budget budget--${status}`} aria-label="Estado del presupuesto">
      <div className="budget__header">
        <span>Presupuesto: {formatCurrency(budget)}</span>
        <span>{percentage}%</span>
      </div>
      <div className="budget__bar">
        <div className="budget__fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <p className="budget__message">{MESSAGES[status]}</p>
    </section>
  )
}