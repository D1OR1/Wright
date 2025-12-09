"use client";

import React, { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

import { GameState } from "./types";
import GameScene from "./GameScene";
import GameUI from "./GameUI";
import styles from "./index.module.css";

const NeonVoidGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleGameOver = useCallback((finalScore: number) => {
    setHighScore((prev) => Math.max(prev, finalScore));
  }, []);

  const handleStart = useCallback(() => {
    window.dispatchEvent(new Event("neon-void-input"));
  }, []);

  const handleRestart = useCallback(() => {
    window.dispatchEvent(new Event("neon-void-input"));
  }, []);

  return (
    <div className={styles.gameContainer}>
      {/* 3D Canvas Layer - Absolute positioning to fill container */}
      <div className={styles.canvasContainer}>
        <Canvas dpr={[1, 2]} style={{ width: "100%", height: "100%" }}>
          <OrthographicCamera makeDefault position={[-2, 0, 10]} zoom={40} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />

          <Suspense fallback={null}>
            <GameScene
              gameState={gameState}
              onGameStateChange={setGameState}
              onScoreChange={setScore}
              onGameOver={handleGameOver}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Layer - Absolute positioning handled inside GameUI */}
      <GameUI
        gameState={gameState}
        score={score}
        highScore={highScore}
        onStart={handleStart}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default NeonVoidGame;
