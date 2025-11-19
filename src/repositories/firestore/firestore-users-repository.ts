import { firestore } from 'firebase-admin'
import { IUser, ICreateUserParams, IUpdateUserParams, IUsersRepository } from '../users-repository'

const userConverter: firestore.FirestoreDataConverter<IUser> = {
	toFirestore(user: IUser): FirebaseFirestore.DocumentData {
		return { ...user }
	},
	fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IUser {
		const data = snapshot.data()
		return {
			id: snapshot.id,
			name: data.name,
			email: data.email,
			password: data.password,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		}
	},
}

export class FirestoreUsersRepository implements IUsersRepository {
	private collection: FirebaseFirestore.CollectionReference<IUser>

	constructor() {
		this.collection = firestore().collection('users').withConverter(userConverter)
	}

	// Retorna todos os usuários — se quiser paginação, podemos ajustar
	async find(): Promise<IUser[]> {
		const snapshot = await this.collection.get()
		return snapshot.docs.map((doc) => doc.data())
	}

	async findById(id: string): Promise<IUser | null> {
		const doc = await this.collection.doc(id).get()
		return doc.exists ? doc.data() ?? null : null
	}

	async create(params: ICreateUserParams): Promise<IUser> {
		const now = firestore.Timestamp.now()
		const ref = this.collection.doc()

		const user: IUser = {
			id: ref.id,
			createdAt: now,
			updatedAt: now,
			...params,
		}

		await ref.set(user)
		return user
	}

	async update(id: string, params: IUpdateUserParams): Promise<IUser | null> {
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
