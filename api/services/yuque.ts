function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin; // 浏览器
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; // 服务器
}

async function requestYuque(path: string) {
  const origin = getOrigin();
  const res = await fetch(
    `${origin}/api/yuque?path=${encodeURIComponent(path)}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`/api/yuque ${res.status}`);

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const json = await res.json();
    // 语雀常见包裹为 { data: ... }，优先返回 data 字段，便于直接渲染
    return Object.prototype.hasOwnProperty.call(json, "data")
      ? json.data
      : json;
  }
  // 非 JSON 的情况直接返回文本
  return await res.text();
}
// 获取知识库
export async function getYuqueStore(repo: string) {
  const path = `/repos/${encodeURIComponent(repo)}/docs`; // 例如 "user/book" 或数字 id
  return requestYuque(path); // 返回数组/对象，浏览器可直接用
}
// 获取用户所有知识库
export async function getYuqueUserRepos(login: string) {
  const path = `/users/${encodeURIComponent(login)}/repos`;
  return requestYuque(path);
}
