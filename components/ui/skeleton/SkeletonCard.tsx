"use client";
import styles from "./SkeletonCard.module.css";

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.avatar}`} />
      </div>
      <div className={`${styles.shimmer} ${styles.title}`} />
      <div className={`${styles.shimmer} ${styles.text}`} />
      <div className={`${styles.shimmer} ${styles.text}`} />
      <div className={styles.footer}>
        <div className={`${styles.shimmer} ${styles.chip}`} />
        <div className={`${styles.shimmer} ${styles.chip}`} />
        <div className={`${styles.shimmer} ${styles.btn}`} />
      </div>
    </div>
  );
}
