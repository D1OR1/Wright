"use client";
import styles from "./index.module.css";

export interface ArticleProps {
  title: string;
  description: string;
  body: string;
  body_html: string;
  date: string;
  count: string;
  onReadMore?: () => void;
  buttonText?: string;
}

function truncateText(text: string, max = 50) {
  if (!text) return "";
  const arr = Array.from(text);
  return arr.length > max ? arr.slice(0, max).join("") + "…" : text;
}
function formatCount(count: number | string) {
  const n = Number(count || 0);
  if (Number.isNaN(n)) return String(count);
  return n.toLocaleString("en-US");
}
function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}
function calculateReadTime(words: string) {
  const minutes = Math.ceil(Number(words) / 200);
  return minutes;
}

export default function Article({
  body,
  body_html,
  title,
  description,
  date,
  onReadMore,
  count,
  buttonText = "阅读更多",
}: ArticleProps) {
  return (
    <article className={styles.docCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <img className={styles.docIcon} src="/docs.svg" alt="docs" />
        </div>
      </div>
      <h3 className={styles.docTitle}>{title}</h3>
      <p className={styles.docDescription} title={description}>
        {truncateText(description, 50)}
      </p>
      <div className={styles.cardFooter}>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <img
              className={styles.countIcon}
              src="/fontNunber.svg"
              alt="count"
            />
            <span className={styles.count}>{`${formatCount(count)} 字`}</span>
          </div>
          <div className={styles.metaItem}>
            <img
              className={styles.footerIcon}
              src="/readTime.svg"
              alt="read time"
            />
            <span className={styles.readTime}>
              {"阅读" + " " + calculateReadTime(count) + " " + "分钟"}
            </span>
          </div>
        </div>
        <div className={styles.dateRow}>
          <div className={styles.dateLeft}>
            <img className={styles.footerIcon} src="/date.svg" alt="date" />
            <span className={styles.date}>{formatDate(date)}</span>
          </div>
          <button className={styles.readBtn} onClick={onReadMore}>
            <img className={styles.readIcon} src="/read.svg" alt="read" />
            {buttonText}
          </button>
        </div>
      </div>
    </article>
  );
}
