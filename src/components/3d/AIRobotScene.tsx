"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Procedural Robot Component
const Robot = ({ state }: { state: string }) => {
    const group = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);

    // Animation targets based on state
    const targetRotationY = state === "LLM" ? 1 : state === "AGENT" ? -1 : 0;

    useFrame((state, delta) => {
        if (group.current) {
            // Smooth rotation
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, delta * 2);
        }
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* HEAD */}
                <group position={[0, 1.5, 0]} ref={headRef}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[1, 0.8, 1]} />
                        <meshPhysicalMaterial
                            color="#1e293b"
                            metalness={0.8}
                            roughness={0.2}
                            clearcoat={1}
                        />
                    </mesh>
                    {/* Face Plate */}
                    <mesh position={[0, 0, 0.51]}>
                        <planeGeometry args={[0.8, 0.5]} />
                        <meshBasicMaterial color="#000" />
                    </mesh>
                    {/* Eyes - Dynamic Color */}
                    <mesh position={[-0.2, 0, 0.52]}>
                        <boxGeometry args={[0.15, 0.05, 0.05]} />
                        <meshBasicMaterial color={state === "AGENT" ? "#06b6d4" : "#6366f1"} toneMapped={false} />
                    </mesh>
                    <mesh position={[0.2, 0, 0.52]}>
                        <boxGeometry args={[0.15, 0.05, 0.05]} />
                        <meshBasicMaterial color={state === "AGENT" ? "#06b6d4" : "#6366f1"} toneMapped={false} />
                    </mesh>
                </group>

                {/* BODY */}
                <group position={[0, 0, 0]}>
                    <mesh castShadow receiveShadow>
                        <capsuleGeometry args={[0.6, 1.5, 4, 8]} />
                        <meshPhysicalMaterial
                            color="#0f172a"
                            metalness={0.7}
                            roughness={0.3}
                            emissive={state === "LLM" ? "#4c1d95" : "#000"}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    {/* Core Light */}
                    <mesh position={[0, 0.2, 0.5]}>
                        <circleGeometry args={[0.15, 32]} />
                        <meshBasicMaterial color={state === "LLM" ? "#a855f7" : "#06b6d4"} toneMapped={false} />
                    </mesh>
                </group>

                {/* ARMS (Abstract floating) */}
                <mesh position={[-1, 0, 0]}>
                    <boxGeometry args={[0.4, 1.2, 0.4]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[1, 0, 0]}>
                    <boxGeometry args={[0.4, 1.2, 0.4]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
            </Float>
        </group>
    );
};

const AIRobotScene = ({ activeSection }: { activeSection: string }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
                <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} castShadow />

                <Robot state={activeSection} />

                {/* Environment Reflections */}
                <Environment preset="city" />

                {/* Contact Shadow for grounding */}
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
};

export default AIRobotScene;
