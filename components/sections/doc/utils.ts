import {
  getYuqueArticle,
  getYuqueArticleList,
  getYuqueStore,
  getYuqueUserRepos,
} from "@/api";
import { YUQUE_USER, defaultRepo } from "@/config";

export interface ArticleType {
  id: string;
  body: string;
  body_html: string;
  title: string;
  description: string;
  published_at: string;
  word_count: string;
}

// 获取用户所有知识库
export async function getUserRepos() {
  return await getYuqueUserRepos(YUQUE_USER);
}
// 获取知识库的信息
export async function getStore(repo: string) {
  return await getYuqueStore(repo);
}

// 获取知识库内的文章列表
export async function getArticleList(repo: string) {
  return await getYuqueArticleList(repo);
}

// 获取知识库内的文章列表长度
export async function getArticleListLength(repo: string) {
  const dataList = await getArticleList(repo);
  return dataList.length;
}

// 获取知识库内的文章
export async function getArticle(repo: string, doc: string) {
  return await getYuqueArticle(repo, doc);
}

// 获取前端知识库defaultRepo
export async function getFrontendArticleList() {
  const dataList = await getArticleList(defaultRepo);
  const articleList: ArticleType[] = [];
  for (let i = 0; i < 6; i++) {
    if (!dataList[i]) break;
    const article = await getArticle(defaultRepo, dataList[i].id);
    if (article.body.length === 0) {
      continue;
    }
    articleList.push(article);
  }
  return articleList;
}

export async function fetchArticlesStream({
  repo,
  startIndex = 0,
  limit = 10,
  onArticleFound,
  abortSignal,
}: {
  repo: string;
  startIndex?: number;
  limit?: number;
  onArticleFound: (article: ArticleType, index: number) => void;
  abortSignal?: AbortSignal;
}) {
  const dataList = await getArticleList(repo);
  let count = 0;
  let currentIndex = startIndex;
  const CONCURRENCY = 3;
  const activePromises: Promise<void>[] = [];

  // 辅助函数：处理单个文章的获取
  const fetchOne = async (index: number) => {
    if (abortSignal?.aborted) return;
    try {
      const article = await getArticle(repo, dataList[index].id);
      if (abortSignal?.aborted) return;

      if (article && article.body && article.body.length > 0) {
        onArticleFound(article, index);
        count++;
      }
    } catch (e) {
      console.error(`Failed to fetch article ${dataList[index].id}`, e);
    }
  };

  // 循环直到达到 limit 或列表结束
  while (currentIndex < dataList.length && count < limit) {
    if (abortSignal?.aborted) break;

    // 如果未达到并发限制，且还有任务，启动新任务
    while (
      activePromises.length < CONCURRENCY &&
      currentIndex < dataList.length &&
      count + activePromises.length < limit // 预测：已完成 + 正在进行 < limit
    ) {
      const promise = fetchOne(currentIndex).then(() => {
        // 任务完成后，从 activePromises 中移除自己
        activePromises.splice(activePromises.indexOf(promise), 1);
      });
      activePromises.push(promise);
      currentIndex++;
    }

    // 等待至少一个任务完成，以便腾出位置或检查是否完成
    if (activePromises.length > 0) {
      await Promise.race(activePromises);
    } else {
      // 如果没有活动任务且还没达到 limit，说明 currentIndex 已经到底了
      break;
    }
  }

  // 等待所有剩余任务完成
  await Promise.all(activePromises);

  // 返回是否还有更多
  return currentIndex < dataList.length;
}

export function jumpToArticle(id: string): string {
  return `https://www.yuque.com/doless-pa4xy/tvr206/${id}`;
}
