export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Comida'
  | 'Transporte'
  | 'Ocio'
  | 'Servicios'
  | 'Salario'
  | 'Otros'

export interface Transaction {
  id: string
  description: string
  amount: number // siempre positivo; el signo lo da `type`
  type: TransactionType
  category: Category
  date: string // formato YYYY-MM-DD
}

export const CATEGORIES: Category[] = [
  'Comida',
  'Transporte',
  'Ocio',
  'Servicios',
  'Salario',
  'Otros',
]