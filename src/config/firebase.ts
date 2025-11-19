import admin, { ServiceAccount } from 'firebase-admin'

import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' }

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

export const firestore = admin.firestore()
