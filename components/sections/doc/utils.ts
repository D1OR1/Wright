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
    const article = await getArticle(defaultRepo, dataList[i].id);
    if (article.body.length === 0) {
      continue;
    }
    articleList.push(article);
  }
  return articleList;
}

export function jumpToArticle(id: string): string {
  return `https://www.yuque.com/doless-pa4xy/tvr206/${id}`;
}
