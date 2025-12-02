"use client";
import styles from "./Docs.module.css";
import { jumpToArticle } from "./utils";
import Article from "./Article";
import SkeletonCard from "@/components/ui/skeleton/SkeletonCard";

import { useArticleStream } from "./useArticleStream";
import { defaultRepo } from "@/config";

export default function Docs({ onLoadMore }: { onLoadMore: () => void }) {
  const {
    articles: dataList,
    loading,
    error,
  } = useArticleStream({
    repo: defaultRepo,
    limit: 6,
  });

  if (error) {
    return (
      <section id="docs" className={`section ${styles.docs}`}>
        <div className="container">
          <div className="text-center">
            <p className={styles.subtitle}>分享我的学习文档</p>
            <div className="py-10 text-red-500">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="docs" className={`section ${styles.docs}`}>
      <div className="container">
        <div className="text-center">
          <p className={styles.subtitle}>分享我的学习文档</p>
        </div>

        <div className={styles.docsGrid}>
          {Array.from({ length: 6 }).map((_, i) => {
            const data = dataList[i];
            if (data) {
              return (
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
              );
            }
            // 如果没有数据（或者正在加载），显示骨架屏
            // 注意：这里不再需要 loading 状态判断，因为只要没数据就显示骨架
            return <SkeletonCard key={`sk-${i}`} />;
          })}
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
