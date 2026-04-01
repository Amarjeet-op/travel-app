// Trip-related Cloud Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const cleanupExpiredTrips = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const expiredTrips = await db.collection('trips').where('status', '==', 'active').where('departureDate', '<', now).get();
    const batch = db.batch();
    expiredTrips.forEach((doc) => batch.update(doc.ref, { status: 'expired' }));
    await batch.commit();
    console.log(`Marked ${expiredTrips.size} trips as expired`);
  });
