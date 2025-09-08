import styles from "./About.module.css";

export default function About() {
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <div className="text-center">
          <h2 className={styles.title}>关于我</h2>
          <p className={styles.subtitle}>让我来介绍一下自己</p>
        </div>

        <div className={styles.content}>
          <div className={styles.textContent}>
            <h3 className={styles.sectionTitle}>我的故事</h3>
            <p className={styles.paragraph}>
              我是一名充满热情的开发者，拥有多年的Web开发经验。
              从最初的前端开发到现在的全栈开发，我一直在不断学习和成长。
            </p>
            <p className={styles.paragraph}>
              我相信技术的力量可以改变世界，所以我致力于用代码创造有价值的产品。
              我喜欢挑战复杂的问题，享受从无到有的创造过程。
            </p>

            <h3 className={styles.sectionTitle}>技能专长</h3>
            <div className={styles.skills}>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>前端开发</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillProgress}
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>后端开发</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillProgress}
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>数据库设计</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillProgress}
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div className={styles.skillItem}>
                <span className={styles.skillName}>DevOps</span>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillProgress}
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>3+</div>
              <div className={styles.statLabel}>年开发经验</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>完成项目</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10+</div>
              <div className={styles.statLabel}>技术栈</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>客户满意度</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
