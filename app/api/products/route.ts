import { uploadResult } from "@/utils/cloudinary";
import {
  imageSchema,
  productSchema,
  validateWithZodSchema,
} from "@/utils/schemas";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawData = Object.fromEntries(formData);

    // اعتبارسنجی با Zod
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const imageFile = formData.get("image") as File;
    validateWithZodSchema(imageSchema, { image: imageFile });
    const featured = Boolean(formData.get("featured"));

    // آپلود تصویر در Cloudinary
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUrl = await uploadResult(buffer);

    // ارسال به بک‌اند خارجی
    const externalApiUrl = process.env.EXTERNAL_API_URL + "/products";
    const response = await axios.post(
      externalApiUrl,
      {
        ...validatedFields,
        image: imageUrl,
        featured,
        clerkId: "demo-user",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
          // یا ارسال توکن Clerk به بک‌اند
        },
      },
    );

    return NextResponse.json(
      { message: "Product created", success: true, product: response.data },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating product";
    return NextResponse.json({ message, success: false }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const externalApiUrl = process.env.EXTERNAL_API_URL + "/products";
  const response = await axios.get(externalApiUrl, { params: { search } });

  return NextResponse.json(response.data);
}
