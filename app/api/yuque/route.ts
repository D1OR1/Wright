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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path"); // 例: repos/user/book/docs
  if (!path) {
    return NextResponse.json({ error: "missing ?path=" }, { status: 400 });
  }

  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;
  const res = await fetch(url, { headers: buildHeaders(), cache: "no-store" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "missing ?path=" }, { status: 400 });
  }
  const body = await req.text(); // 直通转发
  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;
  const res = await fetch(url, {
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
}
