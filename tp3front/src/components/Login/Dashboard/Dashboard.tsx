import { useState } from 'react'
import type { Session } from '../../../lib/auth'
import type { Transaction } from '../../../types'
import { BalanceSummary } from '../BalanceSummary/BalanceSummary'
import { BudgetAlert } from '../BudgetAlert/BudgetAlert'
import { TransactionForm } from '../TransactionForm/TransactionForm'
import { TransactionList } from '../TransactionList/TransactionList'
import './Dashboard.css'

interface DashboardProps {
  session: Session
  onLogout: () => void
}

const MONTHLY_BUDGET = 100000

let counter = 0
function createId(): string {
  counter += 1
  return `${Date.now()}-${counter}`
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  function addTransaction(data: Omit<Transaction, 'id' | 'date'>) {
    const tx: Transaction = {
      ...data,
      id: createId(),
      date: new Date().toISOString().slice(0, 10),
    }
    setTransactions((prev) => [tx, ...prev])
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>💰 Fin de Mes</h1>
        <div className="dashboard__user">
          <span>Hola, {session.username}</span>
          <button onClick={onLogout}>Salir</button>
        </div>
      </header>

      <main className="dashboard__main">
        <BalanceSummary transactions={transactions} />
        <BudgetAlert transactions={transactions} budget={MONTHLY_BUDGET} />
        <TransactionForm onAdd={addTransaction} />
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </main>
    </div>
  )
}