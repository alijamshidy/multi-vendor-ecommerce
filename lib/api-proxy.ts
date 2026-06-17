import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_ORIGIN = (
  process.env.MARKETPLACE_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

/** Backend authMiddleware reads `accessToken` cookie only — inject from Bearer if missing. */
function buildBackendCookieHeader(request: NextRequest): string | null {
  const browserCookie = request.headers.get("cookie") ?? "";

  if (
    browserCookie.includes("accessToken=") ||
    browserCookie.includes("customerToken=")
  ) {
    return browserCookie || null;
  }

  const authorization = request.headers.get("authorization");
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!bearerMatch?.[1]) {
    return browserCookie || null;
  }

  const token = encodeURIComponent(bearerMatch[1].trim());
  const injected = `accessToken=${token}`;
  return browserCookie ? `${browserCookie}; ${injected}` : injected;
}

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[],
) {
  const path = pathSegments.filter(Boolean).join("/");
  const targetUrl = new URL(`${API_ORIGIN}/api/${path}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  const cookie = buildBackendCookieHeader(request);
  if (cookie) headers.set("Cookie", cookie);

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
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[api-proxy] Failed to reach ${targetUrl.href}:`, errMsg);
    return NextResponse.json(
      { error: "Unable to reach the API server" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }

  const setCookie = response.headers.getSetCookie?.() ?? [];
  for (const value of setCookie) {
    responseHeaders.append("Set-Cookie", value);
  }

  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });
}
