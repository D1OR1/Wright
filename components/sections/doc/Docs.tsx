import styles from "./Docs.module.css";

interface DocItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
}

const docs: DocItem[] = [
  {
    id: 1,
    title: "Next.js 14 新特性详解",
    description:
      "深入解析Next.js 14版本带来的新功能和改进，包括App Router的优化、性能提升等。",
    category: "前端技术",
    date: "2024-01-15",
    readTime: "8分钟",
  },
  {
    id: 2,
    title: "React Server Components 实践指南",
    description:
      "学习如何在Next.js中正确使用React Server Components，提升应用性能。",
    category: "React",
    date: "2024-01-10",
    readTime: "12分钟",
  },
  {
    id: 3,
    title: "TypeScript 高级类型系统",
    description:
      "掌握TypeScript的高级类型特性，包括泛型、条件类型、映射类型等。",
    category: "TypeScript",
    date: "2024-01-05",
    readTime: "15分钟",
  },
  {
    id: 4,
    title: "现代CSS布局技术",
    description:
      "探索Flexbox、Grid、Container Queries等现代CSS布局技术的应用。",
    category: "CSS",
    date: "2023-12-28",
    readTime: "10分钟",
  },
  {
    id: 5,
    title: "Node.js 性能优化策略",
    description: "分享Node.js应用性能优化的实用技巧和最佳实践。",
    category: "后端技术",
    date: "2023-12-20",
    readTime: "18分钟",
  },
  {
    id: 6,
    title: "数据库设计原则",
    description: "从关系型到NoSQL，探讨不同场景下的数据库设计原则和选择策略。",
    category: "数据库",
    date: "2023-12-15",
    readTime: "20分钟",
  },
];

export default function Docs() {
  return (
    <section className={`section ${styles.docs}`}>
      <div className="container">
        <div className="text-center">
          <h2 className={styles.title}>技术文档</h2>
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
          {docs.map((doc) => (
            <article key={doc.id} className={styles.docCard}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{doc.category}</span>
                <span className={styles.readTime}>{doc.readTime}</span>
              </div>
              <h3 className={styles.docTitle}>{doc.title}</h3>
              <p className={styles.docDescription}>{doc.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>{doc.date}</span>
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
