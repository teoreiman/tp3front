import { calculateBalance, totalByType, formatCurrency } from '../../../lib/finance'
import type { Transaction } from '../../../types'

interface BalanceSummaryProps {
  transactions: Transaction[]
}

export function BalanceSummary({ transactions }: BalanceSummaryProps) {
  const balance = calculateBalance(transactions)
  const income = totalByType(transactions, 'income')
  const expense = totalByType(transactions, 'expense')

  return (
    <section className="summary" aria-label="Resumen de balance">
      <article className="summary__card summary__card--balance">
        <span className="summary__label">Balance</span>
        <strong className="summary__value" data-testid="balance">
          {formatCurrency(balance)}
        </strong>
      </article>
      <article className="summary__card">
        <span className="summary__label">Ingresos</span>
        <strong className="summary__value summary__value--income">
          {formatCurrency(income)}
        </strong>
      </article>
      <article className="summary__card">
        <span className="summary__label">Egresos</span>
        <strong className="summary__value summary__value--expense">
          {formatCurrency(expense)}
        </strong>
      </article>
    </section>
  )
}