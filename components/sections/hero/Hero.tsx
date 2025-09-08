import Avatar from "../../ui/avartar/Avatar";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <Avatar src="/images/niu.jpg" alt="我的头像" size="medium" />
          <div className={styles.textContent}>
            <h1 className={styles.title}>你好，我是 LitSen</h1>
            <p className={styles.slogan}>用代码创造价值，用技术改变世界</p>
            <p className={styles.description}>
              我是一名全栈开发者，专注于现代Web技术栈。
              热爱学习新技术，享受解决问题的过程。
            </p>
            <div className={styles.cta}>
              <button className={styles.primaryBtn}>了解更多</button>
              <button className={styles.secondaryBtn}>联系我</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
