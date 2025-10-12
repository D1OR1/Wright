"use client";
import React from "react";
import styles from "./TopTabs.module.css";

export type TopTabKey = "home" | "all";

interface TopTabsProps {
  active: TopTabKey;
  onChange: (key: TopTabKey) => void;
}

export default function TopTabs({ active, onChange }: TopTabsProps) {
  return (
    <div className={styles.tabsWrap}>
      <button
        className={`${styles.tabBtn} ${active === "home" ? styles.active : ""}`}
        onClick={() => onChange("home")}
        aria-pressed={active === "home"}
      >
        主页
      </button>
      <button
        className={`${styles.tabBtn} ${active === "all" ? styles.active : ""}`}
        onClick={() => onChange("all")}
        aria-pressed={active === "all"}
      >
        所有文档
      </button>
    </div>
  );
}
