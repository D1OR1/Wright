"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { GameState, TrailPoint, GAME_CONSTANTS } from "./types";
import { useGameEngine } from "./useGameEngine";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Environment from "./Environment";

interface GameSceneProps {
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
}

const GameScene: React.FC<GameSceneProps> = ({
  gameState,
  onGameStateChange,
  onScoreChange,
  onGameOver,
}) => {
  const engine = useGameEngine();
  const [playerY, setPlayerY] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [obstacles, setObstacles] = useState<
    { id: string; x: number; y: number; type: "box" | "pyramid" }[]
  >([]);
  const [speed, setSpeed] = useState<number>(GAME_CONSTANTS.SPEED_BASE);

  // Handle input
  const handleInput = useCallback(() => {
    if (gameState === "playing") {
      engine.flipGravity();
    } else if (gameState === "start" || gameState === "gameover") {
      engine.resetGame();
      setTrail([]);
      onGameStateChange("playing");
    }
  }, [gameState, engine, onGameStateChange]);

  // Input listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleInput();
      }
    };

    const onCustomInput = () => handleInput();

    // 只在游戏进行中响应点击事件，用于翻转重力
    // 开始游戏和重新开始只能通过按钮触发
    const onPointerDown = () => {
      if (gameState === "playing") {
        engine.flipGravity();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("neon-void-input", onCustomInput);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("neon-void-input", onCustomInput);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [handleInput, gameState, engine]);

  // Game loop
  useFrame((state, delta) => {
    if (gameState !== "playing") return;

    const result = engine.update(delta);
    onScoreChange(result.score);
    setPlayerY(result.playerY);

    if (result.collision) {
      onGameStateChange("gameover");
      onGameOver(result.score);
      return;
    }

    // Update trail
    const currentTrail = engine.getTrail();
    engine.addTrailPoint({
      x: GAME_CONSTANTS.PLAYER_X,
      y: result.playerY,
      opacity: 1.0,
    });
    setTrail([...engine.getTrail()]);

    // Update obstacles
    setObstacles(
      engine.getObstacles().map((obs) => ({
        id: obs.id,
        x: obs.x,
        y: obs.y,
        type: obs.type,
      }))
    );

    setSpeed(engine.getSpeed());
  });

  return (
    <>
      <Player
        y={playerY}
        color="#00f3ff"
        isPlaying={gameState === "playing"}
        trail={trail}
      />

      {obstacles.map((obs) => (
        <Obstacle key={obs.id} x={obs.x} y={obs.y} type={obs.type} />
      ))}

      <Environment speed={gameState === "playing" ? speed : 0} />
    </>
  );
};

export default GameScene;
