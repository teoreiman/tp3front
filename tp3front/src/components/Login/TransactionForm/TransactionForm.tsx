import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '../../../types'
import type { Category, Transaction, TransactionType } from '../../../types'

interface TransactionFormProps {
  onAdd: (tx: Omit<Transaction, 'id' | 'date'>) => void
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<Category>('Comida')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!description.trim() || !Number.isFinite(parsed) || parsed <= 0) return

    onAdd({ description: description.trim(), amount: parsed, type, category })
    setDescription('')
    setAmount('')
  }

  return (
    <form className="tx-form" onSubmit={handleSubmit} aria-label="Nueva transacción">
      <input
        name="description"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        name="amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
      >
        <option value="expense">Egreso</option>
        <option value="income">Ingreso</option>
      </select>
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="submit">Agregar</button>
    </form>
  )
}