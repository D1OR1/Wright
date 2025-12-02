"use client";
import styles from "./Docs.module.css";
import Article from "./Article";
import SkeletonCard from "../../ui/skeleton/SkeletonCard";
import { useEffect, useRef } from "react";
import { jumpToArticle } from "./utils";
import { defaultRepo } from "@/config";
import { useArticleStream } from "./useArticleStream";

export default function AllDocs() {
  const BATCH_SIZE = 10;
  const { articles, loading, hasMore, loadMore } = useArticleStream({
    repo: defaultRepo,
    pageSize: BATCH_SIZE,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  // 使用 IntersectionObserver 监听滚动，实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  const skeletonCount =
    loading || (articles.length === 0 && hasMore) ? BATCH_SIZE : 0;

  return (
    <section id="docs-all" className={`section ${styles.docsAll}`}>
      <div className="container">
        <div className="text-center">
          <p className={styles.subtitle}>所有文档</p>
        </div>
        <div className={styles.docsGrid}>
          {articles.map((data: any, index: number) => {
            if (!data) {
              return <SkeletonCard key={`sk-hole-${index}`} />;
            }
            return (
              <Article
                key={data.id}
                title={data.title}
                description={data.description}
                body={data.body}
                body_html={data.body_html}
                date={data.published_at}
                count={data.word_count}
                onReadMore={() => window.open(jumpToArticle(data.id))}
              />
            );
          })}
          {skeletonCount > 0 &&
            Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonCard key={`sk-${articles.length}-${i}`} />
            ))}
        </div>
        {/* 懒加载触发器 */}
        {hasMore && (
          <div
            ref={observerTarget}
            style={{ height: "20px", margin: "20px 0" }}
          />
        )}
      </div>
    </section>
  );
}
