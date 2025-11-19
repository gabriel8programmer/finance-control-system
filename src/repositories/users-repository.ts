import { Timestamp } from 'firebase-admin/firestore'

export interface IUser {
	id: number
	name: string
	email: string
	password: string
	createdAt: Timestamp
	updatedAt: Timestamp
}

export interface ICreateUserParams extends Omit<IUser, 'createdAt' | 'updatedAt' | 'id'> {}

export interface IUpdateUserParams extends Partial<ICreateUserParams> {}

export interface IUsersRepository {
	find: () => Promise<IUser>
	findById: (id: string) => Promise<IUser | null>
	create: (params: ICreateUserParams) => Promise<IUser>
	update: (id: string, params: IUpdateUserParams) => Promise<IUser | null>
	delete: (id: string) => Promise<void>
}
