import { firestore } from 'firebase-admin'
import {
	ICategory,
	ICreateCategoryParams,
	ICategoriesRepository,
	IUpdateCategoryParams,
} from '../categories-repository'

const categoryConverter: firestore.FirestoreDataConverter<ICategory> = {
	toFirestore(category: ICategory): FirebaseFirestore.DocumentData {
		return { ...category }
	},
	fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ICategory {
		const data = snapshot.data()
		return {
			id: snapshot.id,
			name: data.name,
			description: data.description,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	},
}

export class FirestoreCategoriesRepository implements ICategoriesRepository {
	private collection: FirebaseFirestore.CollectionReference<ICategory>

	constructor() {
		this.collection = firestore().collection('categories').withConverter(categoryConverter)
	}

	async find(): Promise<ICategory[]> {
		const snapshot = await this.collection.get()
		return snapshot.docs.map((doc) => doc.data())
	}

	async findById(id: string): Promise<ICategory | null> {
		const doc = await this.collection.doc(id).get()
		return doc.exists ? doc.data() ?? null : null
	}

	async create(params: ICreateCategoryParams): Promise<ICategory> {
		const now = firestore.Timestamp.now()
		const ref = this.collection.doc()

		const category: ICategory = {
			id: ref.id,
			createdAt: now,
			updatedAt: now,
			...params,
		}

		await ref.set(category)
		return category
	}

	async update(id: string, params: IUpdateCategoryParams): Promise<ICategory | null> {
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
