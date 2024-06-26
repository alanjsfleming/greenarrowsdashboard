import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'




const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
})


// Wrap initialization of analytics in analytics.isSupported check
// to ensure it doesn't break your app in browsers that don't support it.
if (isSupported()) {
    const analytics = getAnalytics(app)
    logEvent(analytics, 'notification_received')
}

export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app,process.env.REACT_APP_FIREBASE_DATABASE_URL)
export default app