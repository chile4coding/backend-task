import admin from "firebase-admin";

interface FirebaseAdmin {
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  storageBucket?: string;
}

function formatPrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, "\n");
}

const serviceAccount: FirebaseAdmin = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID!,
  privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
};

export function createFirebaseAdmin(): admin.app.App {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
      storageBucket: serviceAccount.storageBucket,
    });
  }
  return admin.app();
}

export async function initAdmin() {
  return createFirebaseAdmin();
}
