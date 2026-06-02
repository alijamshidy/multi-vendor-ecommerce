import { getApiErrorMessage, registerUser } from "@/lib/auth-api";
import { AxiosError } from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await registerUser(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const status =
      error instanceof AxiosError ? error.response?.status ?? 500 : 500;
    return NextResponse.json(
      { error: getApiErrorMessage(error, "Registration failed") },
      { status },
    );
  }
}
