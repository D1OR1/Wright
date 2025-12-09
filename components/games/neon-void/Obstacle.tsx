"use client";

import React, { useRef, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GAME_CONSTANTS } from "./types";

interface ObstacleProps {
  x: number;
  y: number;
  type: "box" | "pyramid";
}

const Obstacle: React.FC<ObstacleProps> = memo(({ x, y, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x += 0.02;
    }

    // 光环脉冲动画
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }

    // 装饰环旋转
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.05;
      ringsRef.current.rotation.x += 0.02;
    }
  });

  const isTop = y > 0;
  const baseColor = type === "box" ? "#ff0055" : "#ff9900";
  const accentColor = type === "box" ? "#ff3388" : "#ffcc00";

  // 障碍物高度：从地板/天花板延伸到游戏区域
  const obstacleHeight = 1.8; // 增大障碍物高度
  const obstacleWidth = type === "box" ? 0.8 : 0.7;

  // 计算障碍物的 Y 位置偏移，使其从边界向内延伸
  const yOffset = isTop ? -obstacleHeight / 2 + 0.2 : obstacleHeight / 2 - 0.2;

  return (
    <group position={[x, y + yOffset, 0]}>
      {/* 主障碍物体 */}
      {type === "box" ? (
        <>
          {/* 长方柱障碍物 */}
          <mesh ref={meshRef}>
            <boxGeometry args={[obstacleWidth, obstacleHeight, 0.6]} />
            <meshStandardMaterial
              color={baseColor}
              emissive={baseColor}
              emissiveIntensity={2}
              metalness={0.7}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>

          {/* 中心装饰 */}
          <mesh>
            <boxGeometry
              args={[obstacleWidth * 0.6, obstacleHeight * 0.8, 0.65]}
            />
            <meshStandardMaterial
              color="#1a0011"
              emissive={accentColor}
              emissiveIntensity={1}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* 边缘线条 */}
          <mesh position={[0, 0, 0.32]}>
            <boxGeometry
              args={[obstacleWidth * 1.05, obstacleHeight * 1.05, 0.02]}
            />
            <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
          </mesh>
        </>
      ) : (
        <>
          {/* 锥形/棱锥障碍物 - 加长版 */}
          <mesh ref={meshRef}>
            <coneGeometry args={[0.5, obstacleHeight, 6]} />
            <meshStandardMaterial
              color={baseColor}
              emissive={baseColor}
              emissiveIntensity={2}
              metalness={0.7}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>

          {/* 底座环 */}
          <mesh
            position={[0, -obstacleHeight / 2 + 0.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.55, 0.08, 8, 32]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </>
      )}

      {/* 发光光环 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[obstacleHeight * 0.6, 16, 16]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.1} />
      </mesh>

      {/* 旋转装饰环 */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[obstacleHeight * 0.5, 0.02, 8, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <torusGeometry args={[obstacleHeight * 0.55, 0.015, 8, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* 危险指示器 - 顶部/底部闪烁点 */}
      <mesh
        position={[
          0,
          isTop ? -obstacleHeight / 2 - 0.2 : obstacleHeight / 2 + 0.2,
          0,
        ]}
      >
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff0000"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>

      {/* 主光源 */}
      <pointLight color={baseColor} intensity={3} distance={5} decay={2} />

      {/* 辅助光源 - 增强可见性 */}
      <pointLight
        color={accentColor}
        intensity={1.5}
        distance={3}
        decay={2}
        position={[0, isTop ? -0.5 : 0.5, 0.5]}
      />
    </group>
  );
});

Obstacle.displayName = "Obstacle";

export default Obstacle;
