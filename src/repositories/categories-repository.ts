import { Timestamp } from 'firebase-admin/firestore'

export interface ICategory {
	id: string
	name: string
	description?: string
	createdAt: Timestamp
	updatedAt: Timestamp
}

export interface ICreateCategoryParams extends Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'> {}

export interface IUpdateCategoryParams extends Partial<ICreateCategoryParams> {}

export interface ICategoriesRepository {
	find: () => Promise<ICategory[]>
	findById: (id: string) => Promise<ICategory | null>
	create: (params: ICreateCategoryParams) => Promise<ICategory>
	update: (id: string, params: IUpdateCategoryParams) => Promise<ICategory | null>
	delete: (id: string) => Promise<void>
}
