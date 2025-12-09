// Game type definitions
import * as THREE from "three";

export type GameState = "start" | "playing" | "gameover";

export interface ObstacleData {
  id: string;
  x: number;
  y: number;
  type: "box" | "pyramid";
}

export interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

// Game constants for side-scrolling view
export const GAME_CONSTANTS = {
  GRAVITY: 25,
  FLOOR_Y: -2.5,
  CEILING_Y: 2.5,
  PLAYER_X: -5,
  PLAYER_RADIUS: 0.4,
  OBSTACLE_SPAWN_X: 12,
  OBSTACLE_DESPAWN_X: -10,
  SPEED_BASE: 8,
  SPEED_INC: 0.5,
  SPAWN_INTERVAL: 1.5, // seconds
  COLLISION_RADIUS: 1.2,
  TRAIL_LENGTH: 10,
} as const;
