"use client";

import React from "react";
import { GameState } from "./types";
import styles from "./index.module.css";

interface GameUIProps {
  gameState: GameState;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  highScore,
  onStart,
  onRestart,
}) => {
  return (
    <>
      {/* Score Display */}
      <div className={styles.scoreDisplay}>SCORE: {score}</div>

      {/* Start Screen */}
      {gameState === "start" && (
        <div className={`${styles.overlay} ${styles.startOverlay}`}>
          <h1 className={styles.title}>NEON VOID 3D</h1>
          <p className={styles.subtitle}>Gravity Switch Runner</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className={styles.startButton}
          >
            <div className={styles.bgBlur}></div>
            <div className={styles.bgSolid}></div>
            <span className={styles.text}>START GAME</span>
          </button>
          <p className={styles.instruction}>TAP or SPACE to flip gravity</p>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameover" && (
        <div className={`${styles.overlay} ${styles.gameOverOverlay}`}>
          <h2 className={styles.crashedTitle}>CRASHED</h2>
          <div className={styles.scoreContainer}>
            <p className={styles.finalScore}>{score}</p>
            <p className={styles.scoreLabel}>Score</p>
          </div>
          <div className={styles.bestScore}>BEST: {highScore}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className={styles.restartButton}
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </>
  );
};

export default GameUI;
