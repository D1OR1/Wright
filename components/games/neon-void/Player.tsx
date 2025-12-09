"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GAME_CONSTANTS, TrailPoint } from "./types";

interface PlayerProps {
  y: number;
  color: string;
  isPlaying: boolean;
  trail: TrailPoint[];
}

const Player: React.FC<PlayerProps> = ({ y, color, isPlaying, trail }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // 平滑 Y 位置插值
      meshRef.current.position.y += (y - meshRef.current.position.y) * 0.3;
      // 旋转视觉效果
      meshRef.current.rotation.z -= 0.1;
    }
  });

  // 计算正确的拖影位置 - 修复跟随问题
  const trailPositions = useMemo(() => {
    if (trail.length === 0) return [];

    return trail.map((t, i) => {
      const offset = (trail.length - i) * 0.4;
      return {
        x: GAME_CONSTANTS.PLAYER_X - offset,
        y: t.y,
        scale: Math.max(0.1, 1 - (trail.length - i) * 0.08),
        opacity: ((trail.length - i) / trail.length) * 0.6,
      };
    });
  }, [trail]);

  return (
    <group>
      {/* 主玩家球体 */}
      <mesh ref={meshRef} position={[GAME_CONSTANTS.PLAYER_X, 0, 0]}>
        <sphereGeometry args={[GAME_CONSTANTS.PLAYER_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
        <pointLight color={color} intensity={3} distance={8} decay={2} />
      </mesh>

      {/* 拖影粒子 - 修复后的正确跟随 */}
      {trailPositions.map((pos, i) => (
        <mesh
          key={i}
          position={[pos.x, pos.y, 0]}
          scale={[pos.scale, pos.scale, pos.scale]}
        >
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={pos.opacity} />
        </mesh>
      ))}
    </group>
  );
};

export default Player;
