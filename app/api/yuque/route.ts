import { NextRequest, NextResponse } from "next/server";

const BASE = "https://www.yuque.com/api/v2";

function buildHeaders() {
  const token =
    process.env.YUQUE_TOKEN || "usnOSchLQnSP562RQlUBz09g6twZufiEtV6YHDoZ";
  return {
    Accept: "application/json",
    ...(token ? { "X-Auth-Token": String(token) } : {}),
  };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 1000
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (res.status === 429 && retries > 0) {
      const retryAfter = res.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : backoff;
      console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
      await sleep(waitTime);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch failed. Retrying in ${backoff}ms...`, error);
      await sleep(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path"); // 例: repos/user/book/docs
  if (!path) {
    return NextResponse.json({ error: "missing ?path=" }, { status: 400 });
  }

  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;

  try {
    const res = await fetchWithRetry(url, {
      headers: buildHeaders(),
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Yuque API request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "missing ?path=" }, { status: 400 });
  }
  const body = await req.text(); // 直通转发
  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;

  try {
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { ...buildHeaders(), "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Yuque API request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
