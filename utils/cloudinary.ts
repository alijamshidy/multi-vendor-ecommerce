export async function uploadResult(_buffer: Buffer): Promise<string> {
  throw new Error("Cloudinary upload is not configured.");
}

export async function deleteImage(_url: string): Promise<void> {}
