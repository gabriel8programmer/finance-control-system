import { firestore } from 'firebase-admin'
import {
	ITransaction,
	ICreateTransactionParams,
	ITransactionsRepository,
	IUpdateTransactionParams,
} from '../transactions-repository'

const transactionConverter: firestore.FirestoreDataConverter<ITransaction> = {
	toFirestore(transaction: ITransaction): FirebaseFirestore.DocumentData {
		return { ...transaction }
	},
	fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ITransaction {
		const data = snapshot.data()
		return {
			id: snapshot.id,
			amount: data.amount,
			type: data.type,
			categoryId: data.categoryId,
			description: data.description,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	},
}

export class FirestoreTransactionsRepository implements ITransactionsRepository {
	private collection: FirebaseFirestore.CollectionReference<ITransaction>

	constructor() {
		this.collection = firestore().collection('transactions').withConverter(transactionConverter)
	}

	async find(): Promise<ITransaction[]> {
		const snapshot = await this.collection.get()
		return snapshot.docs.map((doc) => doc.data())
	}

	async findById(id: string): Promise<ITransaction | null> {
		const doc = await this.collection.doc(id).get()
		return doc.exists ? doc.data() ?? null : null
	}

	async create(params: ICreateTransactionParams): Promise<ITransaction> {
		const now = firestore.Timestamp.now()
		const ref = this.collection.doc()

		const transaction: ITransaction = {
			id: ref.id,
			createdAt: now,
			updatedAt: now,
			...params,
		}

		await ref.set(transaction)
		return transaction
	}

	async update(id: string, params: IUpdateTransactionParams): Promise<ITransaction | null> {
		const docRef = this.collection.doc(id)
		const doc = await docRef.get()

		if (!doc.exists) return null

		const now = firestore.Timestamp.now()

		await docRef.update({
			...params,
			updatedAt: now,
		})

		const updated = await docRef.get()
		return updated.data() ?? null
	}

	async delete(id: string): Promise<void> {
		await this.collection.doc(id).delete()
	}
}
