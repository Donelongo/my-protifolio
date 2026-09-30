const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

let servicesPromise: Promise<{
  auth: import("firebase/auth").Auth;
  db: import("firebase/firestore").Firestore;
  storage: import("firebase/storage").FirebaseStorage;
  firestore: typeof import("firebase/firestore");
  storageModule: typeof import("firebase/storage");
}> | null = null;

export function getFirebaseServices() {
  if (!firebaseConfigured) return Promise.resolve(null);
  if (!servicesPromise) {
    servicesPromise = Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
      import("firebase/firestore"),
      import("firebase/storage"),
    ]).then(([appModule, authModule, firestore, storageModule]) => {
      const app = appModule.getApps().length
        ? appModule.getApp()
        : appModule.initializeApp(firebaseConfig);
      return {
        auth: authModule.getAuth(app),
        db: firestore.getFirestore(app),
        storage: storageModule.getStorage(app),
        firestore,
        storageModule,
      };
    });
  }
  return servicesPromise;
}
