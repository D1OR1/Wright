"use client";
import styles from "./Docs.module.css";
import Article from "./Article";
import SkeletonCard from "../../ui/skeleton/SkeletonCard";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ArticleType,
  getArticleList,
  getArticle,
  jumpToArticle,
} from "./utils";
import { defaultRepo } from "@/config";

export default function AllDocs() {
  const BATCH_SIZE = 10; // 每批加载10个
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [articleList, setArticleList] = useState<any[]>([]); // 存储所有文章ID列表
  const [currentIndex, setCurrentIndex] = useState(0); // 当前已加载到的索引
  const [hasMore, setHasMore] = useState(true); // 是否还有更多文章
  const observerTarget = useRef<HTMLDivElement>(null);

  // 批量获取文章
  const fetchBatch = useCallback(async () => {
    if (loading || !hasMore || articleList.length === 0) return;

    setLoading(true);
    const endIndex = Math.min(currentIndex + BATCH_SIZE, articleList.length);
    const batch: ArticleType[] = [];

    // 批量请求当前批次的文章
    for (let i = currentIndex; i < endIndex; i++) {
      try {
        const article = await getArticle(defaultRepo, articleList[i].id);
        if (article.word_count > 0) {
          batch.push(article);
        }
      } catch (error) {
        console.error(`获取文章失败: ${articleList[i].id}`, error);
      }
    }

    setArticles((prev) => [...prev, ...batch]);
    setCurrentIndex(endIndex);

    // 检查是否已加载完所有文章
    if (endIndex >= articleList.length) {
      setHasMore(false);
    }

    setLoading(false);
  }, [loading, hasMore, articleList, currentIndex]);

  // 初始化：获取文章列表
  useEffect(() => {
    const init = async () => {
      try {
        const result = await getArticleList(defaultRepo);
        setArticleList(result);
        setHasMore(result.length > 0);
      } catch (error) {
        console.error("获取文章列表失败:", error);
        setHasMore(false);
      }
    };
    init();
  }, []);

  // 当文章列表获取完成后，加载第一批
  useEffect(() => {
    if (articleList.length > 0 && articles.length === 0 && !loading) {
      fetchBatch();
    }
  }, [articleList, articles.length, loading, fetchBatch]);

  // 使用 IntersectionObserver 监听滚动，实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchBatch();
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
  }, [fetchBatch, hasMore, loading]);

  const skeletonCount = loading ? BATCH_SIZE : 0;

  return (
    <section id="docs-all" className={`section ${styles.docsAll}`}>
      <div className="container">
        <div className="text-center">
          <p className={styles.subtitle}>所有文档</p>
        </div>
        <div className={styles.docsGrid}>
          {articles.map((data: any) => (
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
          ))}
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
