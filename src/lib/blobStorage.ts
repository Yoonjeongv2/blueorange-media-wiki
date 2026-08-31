import { put } from '@vercel/blob';

/**
 * base64 이미지를 Vercel Blob에 업로드하고, 바로 <img>에 쓸 수 있는 공개 URL을 반환합니다.
 * BLOB_READ_WRITE_TOKEN은 Vercel 프로젝트에 Blob 스토어를 연결하면 자동으로 주입됩니다.
 */
export async function uploadImageToBlob(
  base64: string,
  mimeType: string,
  filename: string
): Promise<string> {
  const buffer = Buffer.from(base64, 'base64');
  const { url } = await put(`media-updates/${filename}`, buffer, {
    access: 'public',
    contentType: mimeType,
    addRandomSuffix: true,
  });
  return url;
}
