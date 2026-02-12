import ImageKit from '@imagekit/nodejs';
export { toFile } from '@imagekit/nodejs';

let imagekitInstance = null;

export function getImageKit() {
  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return imagekitInstance;
}
