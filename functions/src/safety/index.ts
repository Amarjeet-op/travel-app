// Safety-related Cloud Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const cleanupSafetyCache = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const expired = await db.collection('safetyCache').where('expiresAt', '<', now).get();
    const batch = db.batch();
    expired.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned up ${expired.size} expired safety cache entries`);
  });

export const onReportCreate = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap) => {
    const report = snap.data();
    const admins = await db.collection('users').where('role', '==', 'admin').get();
    const batch = db.batch();
    admins.forEach((adminDoc) => {
      const notifRef = db.collection('notifications').doc();
      batch.set(notifRef, {
        userId: adminDoc.id, type: 'admin_action',
        title: report.type === 'sos' ? '🚨 SOS Alert' : 'New Safety Report',
        body: report.type === 'sos' ? 'Active SOS incident requires attention' : report.description?.substring(0, 100),
        link: `/admin/reports`, read: false,
        data: { reportId: snap.id },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  });
