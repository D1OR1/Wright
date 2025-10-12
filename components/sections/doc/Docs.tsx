"use client";
import styles from "./Docs.module.css";
import { ArticleType, getFrontendArticleList, jumpToArticle } from "./utils";
import Article from "./Article";
import { useEffect, useState } from "react";
import SkeletonCard from "@/components/ui/skeleton/SkeletonCard";

export default function Docs({ onLoadMore }: { onLoadMore: () => void }) {
  const [dataList, setDataList] = useState<ArticleType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFrontendArticleList();
      setDataList(data);
    };
    fetchData();
  }, []);
  return (
    <section id="docs" className={`section ${styles.docs}`}>
      <div className="container">
        <div className="text-center">
          <p className={styles.subtitle}>分享我的学习文档</p>
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
              onReadMore={() => {
                window.open(jumpToArticle(data.id));
              }}
            />
          ))}
          {Array.from({
            length: Math.max(0, 6 - dataList.length),
          }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} />
          ))}
        </div>

        <div className="text-center">
          <button className={styles.loadMoreBtn} onClick={onLoadMore}>
            加载更多
          </button>
        </div>
      </div>
    </section>
  );
}
