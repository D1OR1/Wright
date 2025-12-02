import { useState, useCallback, useEffect, useRef } from "react";
import { ArticleType, fetchArticlesStream } from "./utils";

interface UseArticleStreamOptions {
  repo: string;
  limit?: number; // 如果设置了 limit，则只加载这么多，不分页
  pageSize?: number; // 分页大小，默认 10
}

export function useArticleStream({
  repo,
  limit,
  pageSize = 10,
}: UseArticleStreamOptions) {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const currentIndexRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    // 如果有上一次的请求，取消它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // 如果设置了 limit，就一次性加载 limit 个，否则加载 pageSize 个
      const fetchLimit = limit || pageSize;

      // 如果设置了 limit 且已经加载够了，就不再加载
      if (limit && articles.length >= limit) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const hasNext = await fetchArticlesStream({
        repo,
        startIndex: currentIndexRef.current,
        limit: fetchLimit,
        onArticleFound: (article, index) => {
          if (!mountedRef.current) return;
          setArticles((prev) => {
            const newArr = [...prev];
            // 使用绝对索引放置文章，确保顺序正确且支持并发乱序完成
            newArr[index] = article;
            return newArr;
          });
          // currentIndexRef 不需要在这里增加，因为它是在 fetchArticlesStream 内部控制的
          // 但我们需要跟踪已加载的最大索引以便下一次分页
          currentIndexRef.current = Math.max(
            currentIndexRef.current,
            index + 1
          );
        },
        abortSignal: abortControllerRef.current.signal,
      });

      if (mountedRef.current) {
        // 如果设置了 limit，加载完这一批就结束了
        if (limit) {
          setHasMore(false);
        } else {
          setHasMore(hasNext ?? false);
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Failed to fetch articles:", err);
      if (mountedRef.current) {
        setError("获取文章失败，请稍后重试");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [repo, limit, pageSize, loading, hasMore, articles.length]);

  // 初始加载
  useEffect(() => {
    // 只有当列表为空且没有正在加载时才初始化
    if (articles.length === 0 && !loading && hasMore) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { articles, loading, error, hasMore, loadMore };
}
