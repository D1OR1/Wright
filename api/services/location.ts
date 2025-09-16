export interface LocationData {
  city?: string;
  country?: string;
  region?: string;
  ip?: string;
}

// 从 ipinfo.io 获取原始地理信息
export async function getLocationFromIpInfo(): Promise<LocationData | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://ipinfo.io/json", {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      city: data.city,
      country: data.country,
      region: data.region,
      ip: data.ip,
    } as LocationData;
  } finally {
    clearTimeout(timeoutId);
  }
}
