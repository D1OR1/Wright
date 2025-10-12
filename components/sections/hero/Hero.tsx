"use client";
import { useEffect, useState } from "react";
import Avatar from "../../ui/avartar/Avatar";
import styles from "./Hero.module.css";
import { getLocation } from "./utils";

export default function Hero() {
  const [location, setLocation] = useState<string>("远方");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getLocation();
        if (locationData) {
          // 显示城市名
          const displayLocation = locationData.city || "远方";
          setLocation(displayLocation);
        } else {
          setLocation("远方"); // API 返回 null 时使用默认值
        }
      } catch (error) {
        console.error("获取位置信息失败:", error);
        setLocation("远方"); // 保持默认值
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const scrollToDocs = () => {
    const el = document.getElementById("docs");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <Avatar src="/images/niu.jpg" alt="我的头像" size="medium" />
          <div className={styles.textContent}>
            <h1 className={styles.title}>你好，我是 LitSen</h1>
            <h1 className={styles.slogan}>
              欢迎你， 来自{isLoading ? "远方" : location}的访客
            </h1>

            <p className={styles.description}>
              我是一名前端开发者
              <br />
              希望通过网站记录分享 学习笔记与心得
            </p>
            <div className={styles.cta}>
              <button className={styles.secondaryBtn} onClick={scrollToDocs}>
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
