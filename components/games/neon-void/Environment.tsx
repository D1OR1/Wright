"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GAME_CONSTANTS } from "./types";

interface EnvironmentProps {
  speed: number;
}

// 星际穿梭背景效果
const Environment: React.FC<EnvironmentProps> = ({ speed }) => {
  const starsRef = useRef<THREE.Points>(null);
  const starTrailsRef = useRef<THREE.LineSegments>(null);

  // 星星数量和初始位置
  const starCount = 1000;

  // 创建星星数据
  const { starPositions, starVelocities, starColors, trailPositions } =
    useMemo(() => {
      const positions = new Float32Array(starCount * 3);
      const velocities = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const trails = new Float32Array(starCount * 6); // 每颗星星 2 个点（线段）

      for (let i = 0; i < starCount; i++) {
        // 从远处的随机位置开始
        const theta = Math.random() * Math.PI * 4;
        const phi = Math.random() * Math.PI;
        const distance = 20 + Math.random() * 80;

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * distance;
        positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * distance * 0.3; // 压扁 Y 轴
        positions[i * 3 + 2] = -Math.cos(phi) * distance;

        // 速度向镜头方向
        velocities[i * 3] = -positions[i * 3] * 0.02;
        velocities[i * 3 + 1] = -positions[i * 3 + 1] * 0.02;
        velocities[i * 3 + 2] = Math.abs(positions[i * 3 + 2]) * 0.03;

        // 星星颜色：更鲜艳饱和的霓虹色彩
        const colorChoice = Math.random();
        if (colorChoice < 0.12) {
          // 纯青色 - 更亮
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.24) {
          // 纯白色 - 最亮
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.36) {
          // 亮粉红 - 更饱和
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.1;
          colors[i * 3 + 2] = 0.6;
        } else if (colorChoice < 0.48) {
          // 亮橙色 - 更饱和
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.5;
          colors[i * 3 + 2] = 0;
        } else if (colorChoice < 0.6) {
          // 纯绿色 - 更亮
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0.3;
        } else if (colorChoice < 0.72) {
          // 纯紫色 - 更饱和
          colors[i * 3] = 0.6;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.84) {
          // 纯蓝色 - 更深
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 0.4;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.92) {
          // 纯红色 - 更饱和
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.1;
          colors[i * 3 + 2] = 0.1;
        } else {
          // 金黄色 - 更亮
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.85;
          colors[i * 3 + 2] = 0;
        }

        // 拖尾线段初始位置
        trails[i * 6] = positions[i * 3];
        trails[i * 6 + 1] = positions[i * 3 + 1];
        trails[i * 6 + 2] = positions[i * 3 + 2];
        trails[i * 6 + 3] = positions[i * 3];
        trails[i * 6 + 4] = positions[i * 3 + 1];
        trails[i * 6 + 5] = positions[i * 3 + 2] - 2;
      }

      return {
        starPositions: positions,
        starVelocities: velocities,
        starColors: colors,
        trailPositions: trails,
      };
    }, []);

  // 动画更新
  useFrame((state, delta) => {
    if (!starsRef.current || !starTrailsRef.current) return;

    const positions = starsRef.current.geometry.attributes.position
      .array as Float32Array;
    const trails = starTrailsRef.current.geometry.attributes.position
      .array as Float32Array;
    const baseSpeed = speed > 0 ? speed * 0.15 : 1;

    for (let i = 0; i < starCount; i++) {
      // 更新星星位置 - 向镜头飞来
      positions[i * 3] += starVelocities[i * 3] * baseSpeed * delta * 60;
      positions[i * 3 + 1] +=
        starVelocities[i * 3 + 1] * baseSpeed * delta * 60;
      positions[i * 3 + 2] +=
        starVelocities[i * 3 + 2] * baseSpeed * delta * 60;

      // 如果星星飞过镜头，重置到远处
      if (positions[i * 3 + 2] > 5) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const distance = 50 + Math.random() * 50;

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * distance;
        positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * distance * 0.3;
        positions[i * 3 + 2] = -distance;

        starVelocities[i * 3] = -positions[i * 3] * 0.02;
        starVelocities[i * 3 + 1] = -positions[i * 3 + 1] * 0.02;
        starVelocities[i * 3 + 2] = Math.abs(positions[i * 3 + 2]) * 0.03;
      }

      // 更新拖尾线段 - 根据速度拉长
      const trailLength = Math.min(baseSpeed * 0.8, 3);
      trails[i * 6] = positions[i * 3];
      trails[i * 6 + 1] = positions[i * 3 + 1];
      trails[i * 6 + 2] = positions[i * 3 + 2];
      trails[i * 6 + 3] =
        positions[i * 3] - starVelocities[i * 3] * trailLength * 5;
      trails[i * 6 + 4] =
        positions[i * 3 + 1] - starVelocities[i * 3 + 1] * trailLength * 5;
      trails[i * 6 + 5] =
        positions[i * 3 + 2] - starVelocities[i * 3 + 2] * trailLength * 5;
    }

    starsRef.current.geometry.attributes.position.needsUpdate = true;
    starTrailsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // 网格线
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];

    // 地板网格
    for (let i = -15; i <= 15; i++) {
      lines.push(
        <line key={`floor-v-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={
                new Float32Array([
                  i * 2,
                  GAME_CONSTANTS.FLOOR_Y - 0.05,
                  -4,
                  i * 2,
                  GAME_CONSTANTS.FLOOR_Y - 0.05,
                  4,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color="#00f3ff"
            opacity={0.3}
            transparent
          />
        </line>
      );
    }

    // 天花板网格
    for (let i = -15; i <= 15; i++) {
      lines.push(
        <line key={`ceil-v-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={
                new Float32Array([
                  i * 2,
                  GAME_CONSTANTS.CEILING_Y + 0.05,
                  -4,
                  i * 2,
                  GAME_CONSTANTS.CEILING_Y + 0.05,
                  4,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color="#ff0055"
            opacity={0.3}
            transparent
          />
        </line>
      );
    }

    return lines;
  }, []);

  return (
    <group position={[-2, 0, 0]}>
      {/* 深空背景 */}
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[300, 100]} />
        <meshBasicMaterial color="#000005" />
      </mesh>

      {/* 星际穿梭 - 星星点 */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* 星际穿梭 - 拖尾线 */}
      <lineSegments ref={starTrailsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount * 2}
            array={trailPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4488ff" transparent opacity={0.4} />
      </lineSegments>

      {/* 地板平面 */}
      <mesh
        position={[0, GAME_CONSTANTS.FLOOR_Y - 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[70, 8]} />
        <meshStandardMaterial
          color="#050510"
          emissive="#00f3ff"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* 天花板平面 */}
      <mesh
        position={[0, GAME_CONSTANTS.CEILING_Y + 0.1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[70, 8]} />
        <meshStandardMaterial
          color="#050510"
          emissive="#ff0055"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* 地板发光边界 */}
      <mesh position={[0, GAME_CONSTANTS.FLOOR_Y, 0]}>
        <boxGeometry args={[70, 0.06, 0.06]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>
      <mesh position={[0, GAME_CONSTANTS.FLOOR_Y, 0]}>
        <boxGeometry args={[70, 0.2, 0.2]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.15} />
      </mesh>

      {/* 天花板发光边界 */}
      <mesh position={[0, GAME_CONSTANTS.CEILING_Y, 0]}>
        <boxGeometry args={[70, 0.06, 0.06]} />
        <meshBasicMaterial color="#ff0055" />
      </mesh>
      <mesh position={[0, GAME_CONSTANTS.CEILING_Y, 0]}>
        <boxGeometry args={[70, 0.2, 0.2]} />
        <meshBasicMaterial color="#ff0055" transparent opacity={0.15} />
      </mesh>

      {/* 网格线 */}
      {gridLines}

      {/* 环境光 */}
      <ambientLight intensity={0.1} color="#8888ff" />
    </group>
  );
};

export default Environment;
