import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_ORIGIN = (process.env.API_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[],
) {
  const path = pathSegments.filter(Boolean).join("/");
  const targetUrl = new URL(`${API_ORIGIN}/api/v1/${path}/`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(
      `[api-proxy] Failed to reach ${targetUrl.href}:`,
      errMsg,
    );
    return NextResponse.json(
      { message: "Unable to reach the API server" },
      { status: 502 },
    );
  }

  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
