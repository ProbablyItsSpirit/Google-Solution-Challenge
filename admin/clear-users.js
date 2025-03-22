import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFile } from 'fs/promises';

// Read and parse the service account file
const serviceAccountPath = new URL('../backend/firebase-admin-sdk.json', import.meta.url);
const serviceAccount = JSON.parse(
  await readFile(serviceAccountPath, 'utf8')
);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

async function deleteAllUsers() {
  try {
    // Get auth instance
    const auth = getAuth();
    
    // List all users
    const listUsersResult = await auth.listUsers();
    
    // Delete users in batches
    const deletePromises = listUsersResult.users.map(userRecord => 
      auth.deleteUser(userRecord.uid)
        .then(() => console.log(`Deleted user: ${userRecord.email}`))
        .catch(error => console.error(`Error deleting ${userRecord.email}:`, error))
    );
    
    await Promise.all(deletePromises);
    console.log('All users deleted successfully');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

deleteAllUsers();
