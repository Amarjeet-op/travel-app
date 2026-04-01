import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onStatusChange = functions.database
  .ref('/status/{uid}')
  .onWrite(async (change) => {
    const uid = change.after.key;
    const data = change.after.val();
    if (data) {
      await db.collection('users').doc(uid).update({
        isOnline: data.state === 'online',
        lastSeen: admin.firestore.Timestamp.fromMillis(data.lastChanged),
      });
    }
  });
