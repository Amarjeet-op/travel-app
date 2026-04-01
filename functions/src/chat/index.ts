// Chat-related Cloud Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onMessageCreate = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const msg = snap.data();
    const conversationId = context.params.conversationId;
    const convRef = db.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    const conv = convDoc.data();
    if (!conv) return;
    const otherUserId = conv.participants.find((p: string) => p !== msg.senderId);
    await convRef.update({
      lastMessage: msg.content.substring(0, 100),
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessageBy: msg.senderId,
      [`unread.${otherUserId}`]: admin.firestore.FieldValue.increment(1),
    });
    await db.collection('notifications').add({
      userId: otherUserId, type: 'new_message',
      title: `New message from ${msg.senderName}`,
      body: msg.content.substring(0, 100),
      link: `/messages/${conversationId}`, read: false,
      data: { conversationId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
