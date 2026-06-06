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

  // #region agent log
  fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "e997a5",
    },
    body: JSON.stringify({
      sessionId: "e997a5",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "api-proxy.ts:proxyToBackend",
      message: "proxy request start",
      data: {
        apiOrigin: API_ORIGIN,
        targetUrl: targetUrl.href,
        envApiUrl: process.env.API_URL ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  // #region agent log
  fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "e997a5",
    },
    body: JSON.stringify({
      sessionId: "e997a5",
      location: "api-proxy.ts:proxyToBackend",
      message: "proxy request start",
      data: {
        apiOrigin: API_ORIGIN,
        targetUrl: targetUrl.href,
        method: request.method,
      },
      timestamp: Date.now(),
      hypothesisId: "A",
      runId: "pre-fix",
    }),
  }).catch(() => {});
  // #endregion

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
    // #region agent log
    fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e997a5",
      },
      body: JSON.stringify({
        sessionId: "e997a5",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "api-proxy.ts:proxyToBackend:catch",
        message: "proxy fetch failed",
        data: { targetUrl: targetUrl.href, apiOrigin: API_ORIGIN, errMsg },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
