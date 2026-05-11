import axios from "axios";
import { NextResponse } from "next/server";

// GET Request
export async function GET() {
  try {
    // گرفتن پارامترهای query (مثلاً ?id=123)
    // const searchParams = request.nextUrl.searchParams;
    // const id = searchParams.get("id");

    // درخواست به API خارجی با axios
    const response = await axios.get(
      "http://localhost:5000/api/home/get-categorys",
      {
        // params: { id },
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': 'Bearer YOUR_TOKEN'
        },
      },
    );
    return { data: response.data, status: 200 };
    // برگرداندن پاسخ موفق
    // return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);

    // مدیریت خطاهای axios
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || "External API error" },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST Request
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const response = await axios.post(
//       "http://localhost:5000/api/seller-register/",
//       { a: "a" },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     return NextResponse.json(response.data, { status: 201 });
//   } catch (error) {
//     console.error("POST Error:", error);
//     return NextResponse.json({ error: "Request failed" }, { status: 500 });
//   }
// }
export async function POST() {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/admin-login/",
      { email: "a@admin.com", password: "ali.1383" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return { data: response.data, status: 201 };
    // return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
