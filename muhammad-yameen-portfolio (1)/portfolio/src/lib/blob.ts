import { put, del } from '@vercel/blob';

const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500MB ceiling (Vercel Blob supports much larger via client uploads if needed later)
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

export type UploadKind = 'video' | 'image';

export async function uploadToBlob(file: File, kind: UploadKind) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'Missing BLOB_READ_WRITE_TOKEN. Create a Blob store in your Vercel project (Storage tab) and add the token to your environment variables.'
    );
  }

  if (kind === 'video') {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      throw new Error('Unsupported video format. Use MP4, WebM, or MOV.');
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error('Video is too large. Maximum size is 500MB.');
    }
  } else {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Unsupported image format. Use PNG, JPG, WEBP, GIF, or SVG.');
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error('Image is too large. Maximum size is 15MB.');
    }
  }

  const folder = kind === 'video' ? 'videos' : 'images';
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const key = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(key, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return blob.url;
}

export async function deleteFromBlob(url: string) {
  try {
    await del(url);
  } catch {
    // Non-fatal: the DB record removal is what matters most to the UI.
  }
}
