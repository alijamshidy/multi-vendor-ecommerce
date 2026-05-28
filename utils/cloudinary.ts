export async function uploadResult(buffer: Buffer) {
  if (!buffer.byteLength) {
    throw new Error("Image buffer is empty");
  }

  return "/images/hero1.jpg";
}
