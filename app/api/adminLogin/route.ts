import Axios from "@/lib/axios";
import { AxiosError } from "axios";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();
    console.log(email, password);

    // اعتبارسنجی ساده
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const response = await Axios.post("/seller-login/", {
      email: email,
      password: password,
    });
    // const response = { data: { email, password } };
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Proxy error:", error);

    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
};
