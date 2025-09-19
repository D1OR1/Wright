"use client";
import styles from "./Docs.module.css";
import { ArticleType, getFrontendArticleList } from "./utils";
import Article from "./Article";
import { useEffect, useState } from "react";

export default function Docs() {
  const [dataList, setDataList] = useState<ArticleType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFrontendArticleList();
      setDataList(data);
    };
    fetchData();
  }, []);
  return (
    <section className={`section ${styles.docs}`}>
      <div className="container">
        <div className="text-center">
          <p className={styles.subtitle}>分享我的技术见解和学习心得</p>
        </div>

        <div className={styles.docsGrid}>
          {dataList.map((data: any) => (
            <Article
              key={data.id}
              title={data.title}
              description={data.description}
              body={data.body}
              body_html={data.body_html}
              date={data.published_at}
              count={data.word_count}
            />
          ))}
        </div>

        <div className="text-center">
          <button className={styles.loadMoreBtn}>加载更多</button>
        </div>
      </div>
    </section>
  );
}
