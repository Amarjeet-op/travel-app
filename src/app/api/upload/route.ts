import { NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { path, contentType } = await request.json();
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const file = bucket.file(path);
    const [url] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
    return NextResponse.json({ uploadUrl: url, downloadUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
