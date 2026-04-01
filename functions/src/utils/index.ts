// Shared utilities for Cloud Functions
import * as admin from 'firebase-admin';

export async function sendNotification(userId: string, type: string, title: string, body: string, link: string, data?: object) {
  await admin.firestore().collection('notifications').add({
    userId, type, title, body, link, read: false, data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function logAdminAction(adminId: string, adminEmail: string, adminName: string, action: string, targetType: string, targetId: string, details: string) {
  await admin.firestore().collection('adminLogs').add({
    adminId, adminEmail, adminName, action, targetType, targetId, details,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
