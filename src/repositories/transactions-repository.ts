import { Timestamp } from 'firebase-admin/firestore'

export interface ITransaction {
	id: string
	amount: number
	type: 'income' | 'expense'
	categoryId: string
	description?: string
	createdAt: Timestamp
	updatedAt: Timestamp
}

export interface ICreateTransactionParams
	extends Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt'> {}

export interface IUpdateTransactionParams extends Partial<ICreateTransactionParams> {}

export interface ITransactionsRepository {
	find: () => Promise<ITransaction[]>
	findById: (id: string) => Promise<ITransaction | null>
	create: (params: ICreateTransactionParams) => Promise<ITransaction>
	update: (id: string, params: IUpdateTransactionParams) => Promise<ITransaction | null>
	delete: (id: string) => Promise<void>
}
