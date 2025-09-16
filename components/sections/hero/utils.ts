// 定义位置信息的类型
interface LocationData {
  city?: string;
  country?: string;
  region?: string;
  ip?: string;
}

// 城市中英文映射表
const cityTranslations: Record<string, string> = {
  // 中国主要城市
  beijing: "北京",
  shanghai: "上海",
  guangzhou: "广州",
  shenzhen: "深圳",
  hangzhou: "杭州",
  nanjing: "南京",
  wuhan: "武汉",
  chengdu: "成都",
  xian: "西安",
  tianjin: "天津",
  chongqing: "重庆",
  suzhou: "苏州",
  dalian: "大连",
  qingdao: "青岛",
  xiamen: "厦门",
  kunming: "昆明",
  harbin: "哈尔滨",
  shenyang: "沈阳",
  changsha: "长沙",
  jinan: "济南",
  zhengzhou: "郑州",
  taiyuan: "太原",
  shijiazhuang: "石家庄",
  hefei: "合肥",
  nanchang: "南昌",
  fuzhou: "福州",
  guiyang: "贵阳",
  haikou: "海口",
  nanning: "南宁",
  hohhot: "呼和浩特",
  yinchuan: "银川",
  xining: "西宁",
  urumqi: "乌鲁木齐",
  lhasa: "拉萨",
  hongkong: "香港",
};

// 翻译函数
function translateLocation(city?: string): { city: string } {
  const translatedCity = city
    ? cityTranslations[city.toLowerCase().trim().replace(/[^\w]/g, "")] || city
    : "远方";
  return {
    city: translatedCity,
  };
}

// 添加缓存机制
let locationCache: LocationData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export async function getLocation(): Promise<LocationData | null> {
  try {
    // 检查缓存
    const now = Date.now();
    if (locationCache && now - lastFetchTime < CACHE_DURATION) {
      console.log("使用缓存的位置信息:", locationCache);
      return locationCache;
    }

    const locationData = await tryMultipleApis();

    if (locationData) {
      // 翻译城市和国家名称
      const { city } = translateLocation(locationData.city);
      const translatedData = {
        ...locationData,
        city,
      };

      // 更新缓存
      locationCache = translatedData;
      lastFetchTime = now;
      console.log("获取位置成功:", translatedData);
      return translatedData;
    }

    // 所有 API 都失败时返回默认值
    return { city: "远方", country: "未知" };
  } catch (error) {
    console.error("获取位置信息时发生错误:", error);
    return { city: "远方", country: "未知" };
  }
}

import { getLocationFromIpInfo } from "@/api";

async function tryMultipleApis(): Promise<LocationData | null> {
  // 统一从 API 服务层获取位置信息，便于后续替换/扩展数据源
  return await getLocationFromIpInfo();
}
