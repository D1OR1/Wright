"use client";

import { useRef, useCallback } from "react";
import { GameState, ObstacleData, TrailPoint, GAME_CONSTANTS } from "./types";

let obstacleIdCounter = 0;
const generateId = () => `obs_${++obstacleIdCounter}`;

interface GameEngineState {
  playerY: number;
  playerVelY: number;
  gravityDir: number; // 1 = down, -1 = up
  speed: number;
  score: number;
  obstacles: ObstacleData[];
  trail: TrailPoint[];
  timeSinceLastSpawn: number;
}

interface UseGameEngineReturn {
  state: React.MutableRefObject<GameEngineState>;
  flipGravity: () => void;
  resetGame: () => void;
  update: (delta: number) => {
    score: number;
    collision: boolean;
    playerY: number;
  };
  addTrailPoint: (point: TrailPoint) => void;
  getTrail: () => TrailPoint[];
  getObstacles: () => ObstacleData[];
  getSpeed: () => number;
  getPlayerY: () => number;
}

export function useGameEngine(): UseGameEngineReturn {
  const state = useRef<GameEngineState>({
    playerY: 0,
    playerVelY: 0,
    gravityDir: 1,
    speed: GAME_CONSTANTS.SPEED_BASE,
    score: 0,
    obstacles: [],
    trail: [],
    timeSinceLastSpawn: 0,
  });

  const flipGravity = useCallback(() => {
    state.current.gravityDir *= -1;
  }, []);

  const resetGame = useCallback(() => {
    state.current = {
      playerY: 0,
      playerVelY: 0,
      gravityDir: 1,
      speed: GAME_CONSTANTS.SPEED_BASE,
      score: 0,
      obstacles: [],
      trail: [],
      timeSinceLastSpawn: 0,
    };
    obstacleIdCounter = 0;
  }, []);

  const addTrailPoint = useCallback((point: TrailPoint) => {
    state.current.trail = [
      ...state.current.trail.slice(-GAME_CONSTANTS.TRAIL_LENGTH),
      point,
    ];
  }, []);

  const getTrail = useCallback(() => state.current.trail, []);
  const getObstacles = useCallback(() => state.current.obstacles, []);
  const getSpeed = useCallback(() => state.current.speed, []);
  const getPlayerY = useCallback(() => state.current.playerY, []);

  const update = useCallback(
    (delta: number): { score: number; collision: boolean; playerY: number } => {
      const s = state.current;
      const {
        GRAVITY,
        FLOOR_Y,
        CEILING_Y,
        PLAYER_X,
        SPAWN_INTERVAL,
        OBSTACLE_SPAWN_X,
        OBSTACLE_DESPAWN_X,
        COLLISION_RADIUS,
        SPEED_INC,
      } = GAME_CONSTANTS;

      // Apply Gravity
      s.playerVelY -= GRAVITY * s.gravityDir * delta;
      s.playerY += s.playerVelY * delta;

      // Clamp to floor/ceiling
      if (s.playerY < FLOOR_Y) {
        s.playerY = FLOOR_Y;
        s.playerVelY = 0;
      } else if (s.playerY > CEILING_Y) {
        s.playerY = CEILING_Y;
        s.playerVelY = 0;
      }

      // Spawn obstacles
      s.timeSinceLastSpawn += delta;
      if (
        s.timeSinceLastSpawn >
        SPAWN_INTERVAL / (s.speed / GAME_CONSTANTS.SPEED_BASE)
      ) {
        s.timeSinceLastSpawn = 0;
        const isTop = Math.random() > 0.5;
        const y = isTop ? CEILING_Y : FLOOR_Y;
        s.obstacles.push({
          id: generateId(),
          x: OBSTACLE_SPAWN_X,
          y,
          type: Math.random() > 0.7 ? "pyramid" : "box",
        });
      }

      // Move obstacles left
      let collision = false;
      for (const obs of s.obstacles) {
        obs.x -= s.speed * delta;

        // Collision detection (simple distance check)
        const dx = PLAYER_X - obs.x;
        const dy = s.playerY - obs.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < COLLISION_RADIUS) {
          collision = true;
        }
      }

      // Cleanup off-screen obstacles and add score
      const oldLength = s.obstacles.length;
      s.obstacles = s.obstacles.filter((obs) => obs.x > OBSTACLE_DESPAWN_X);
      if (s.obstacles.length < oldLength) {
        s.score += oldLength - s.obstacles.length;
      }

      // Increase speed over time
      s.speed += SPEED_INC * delta;

      return { score: s.score, collision, playerY: s.playerY };
    },
    []
  );

  return {
    state,
    flipGravity,
    resetGame,
    update,
    addTrailPoint,
    getTrail,
    getObstacles,
    getSpeed,
    getPlayerY,
  };
}
