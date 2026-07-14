"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/* ============================================================
   Bandeira rubro-negra — plano com onda senoidal no vertex
   shader e listras horizontais no fragment shader.
   ============================================================ */
const flagVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // presa à esquerda (uv.x = 0), balança livre à direita
    float edge = smoothstep(0.0, 1.0, uv.x);
    float w1 = sin(uv.x * 6.0  - uTime * 2.1);
    float w2 = sin(uv.x * 11.0 - uTime * 3.0 + uv.y * 3.0);
    float w3 = sin(uv.y * 5.0  - uTime * 1.3);
    float wave = (w1 * 0.55 + w2 * 0.28 + w3 * 0.17) * edge;

    pos.z += wave * 0.45;
    pos.y += wave * 0.09;
    vWave = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const flagFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vWave;

  void main() {
    // 4 faixas rubras + 4 negras (o manto)
    float idx = floor(vUv.y * 8.0);
    float isRed = mod(idx, 2.0);
    vec3 red   = vec3(0.878, 0.106, 0.133);
    vec3 black = vec3(0.055, 0.045, 0.048);
    vec3 col = mix(black, red, isRed);

    // sombreamento a partir da ondulação — dá volume ao tecido
    float shade = 0.78 + vWave * 0.6;
    col *= clamp(shade, 0.4, 1.4);

    // bordas suaves para fundir com a atmosfera do hero
    float aX = smoothstep(0.0, 0.10, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    float aY = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
    gl_FragColor = vec4(col, aX * aY * 0.85);
  }
`;

function Flag({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[1.5, 0.42, -0.6]} rotation={[0.09, -0.38, -0.07]}>
      <planeGeometry args={[4.8, 2.8, 48, 32]} />
      <shaderMaterial
        ref={mat}
        vertexShader={flagVertex}
        fragmentShader={flagFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ============================================================
   Brasas de sinalizador — pontos que sobem em loop no shader
   (zero custo de CPU por frame).
   ============================================================ */
const emberVertex = /* glsl */ `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;
  varying float vLife;

  void main() {
    vec3 pos = position;
    float t = uTime * aSpeed + aPhase;
    float y = mod(pos.y + t, 6.5) - 1.4;
    float sway = sin(t * 1.6 + pos.x * 2.2) * 0.4;
    vec3 p = vec3(pos.x + sway, y, pos.z);

    // nasce embaixo, morre em cima
    vLife = smoothstep(-1.4, -0.4, y) * (1.0 - smoothstep(3.0, 5.1, y));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (150.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const emberFragment = /* glsl */ `
  varying float vLife;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float dot = smoothstep(0.5, 0.05, d);
    // núcleo âmbar → borda rubra
    vec3 col = mix(vec3(0.88, 0.11, 0.13), vec3(1.0, 0.45, 0.18), dot * 0.8);
    gl_FragColor = vec4(col, dot * vLife * 0.85);
  }
`;

const EMBERS = 220;

function Embers({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, speeds, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(EMBERS * 3);
    const speeds = new Float32Array(EMBERS);
    const sizes = new Float32Array(EMBERS);
    const phases = new Float32Array(EMBERS);
    for (let i = 0; i < EMBERS; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11; // x
      positions[i * 3 + 1] = Math.random() * 6.5; // y (offset no loop)
      positions[i * 3 + 2] = -1.5 + Math.random() * 2.4; // z
      speeds[i] = 0.25 + Math.random() * 0.6;
      sizes[i] = 2.2 + Math.random() * 4.2;
      phases[i] = Math.random() * 6.5;
    }
    return { positions, speeds, sizes, phases };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (!reduced && mat.current) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={emberVertex}
        fragmentShader={emberFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   Canvas — pausa quando o hero sai da viewport e respeita
   prefers-reduced-motion (renderiza um frame estático).
   ============================================================ */
export default function FlagCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="hero__canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "never" : visible ? "always" : "never"}
      >
        <Flag reduced={reduced} />
        <Embers reduced={reduced} />
      </Canvas>
    </div>
  );
}
