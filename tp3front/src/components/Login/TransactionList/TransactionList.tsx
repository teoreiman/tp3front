import { formatCurrency } from '../../../lib/finance'
import type { Transaction } from '../../../types'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="tx-list__empty">Todavía no cargaste transacciones.</p>
  }

  return (
    <ul className="tx-list" data-testid="tx-list">
      {transactions.map((t) => (
        <li key={t.id} className={`tx-list__item tx-list__item--${t.type}`}>
          <div className="tx-list__info">
            <span className="tx-list__desc">{t.description}</span>
            <span className="tx-list__meta">
              {t.category} · {t.date}
            </span>
          </div>
          <span className="tx-list__amount">
            {t.type === 'expense' ? '-' : '+'}
            {formatCurrency(t.amount)}
          </span>
          <button
            className="tx-list__delete"
            aria-label={`Eliminar ${t.description}`}
            onClick={() => onDelete(t.id)}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}