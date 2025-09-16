"use client";
import styles from "./Docs.module.css";
import { getStore, getUserRepos } from "./utils";

export default async function Docs() {
  const data = await getUserRepos();
  const dataList = data;
  const dataList2 = await getStore();
  console.log(dataList2, "dataList2");

  return (
    <section className={`section ${styles.docs}`}>
      <div className="container">
        <div className="text-center">
          <h2 className={styles.title}>你好</h2>
          <p className={styles.subtitle}>分享我的技术见解和学习心得</p>
        </div>

        <div className={styles.filter}>
          <button className={`${styles.filterBtn} ${styles.active}`}>
            全部
          </button>
          <button className={styles.filterBtn}>前端技术</button>
          <button className={styles.filterBtn}>后端技术</button>
          <button className={styles.filterBtn}>数据库</button>
          <button className={styles.filterBtn}>工具</button>
        </div>

        <div className={styles.docsGrid}>
          {dataList.map((data: any) => (
            <article key={data.id} className={styles.docCard}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{data.name}</span>
                <span className={styles.readTime}>{data.readTime}</span>
              </div>
              <h3 className={styles.docTitle}>{data.title}</h3>
              <p className={styles.docDescription}>{data.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>{data.date}</span>
                <button className={styles.readBtn}>阅读更多</button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <button className={styles.loadMoreBtn}>加载更多</button>
        </div>
      </div>
    </section>
  );
}
