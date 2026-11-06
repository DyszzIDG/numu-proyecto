"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Torus, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

const GradCap = ({ hovered }: { hovered: boolean }) => {
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (group.current) {
            // Gentle float always
            // Hover: Rotate to face camera and tilt
            const targetRotX = hovered ? 0.4 : 0;
            const targetRotY = hovered ? 0.5 : 0;
            const targetScale = hovered ? 1.3 : 1;

            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, delta * 3);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, delta * 3);
            group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
        }
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Board */}
                <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[1.5, 0.1, 1.5]} />
                    <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.5} /> {/* Emerald */}
                </mesh>

                {/* Cap Base */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.5, 0.6, 0.6, 32]} />
                    <meshStandardMaterial color="#065f46" roughness={0.5} />
                </mesh>

                {/* Tassel */}
                <group position={[0.7, 0.5, 0.7]}>
                    <mesh position={[0, -0.3, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                        <meshStandardMaterial color="#fbbf24" /> {/* Gold */}
                    </mesh>
                    <mesh position={[0, -0.6, 0]}>
                        <sphereGeometry args={[0.08]} />
                        <meshStandardMaterial color="#fbbf24" />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

const CyberGradCapScene = ({ hovered }: { hovered: boolean }) => {
    return (
        <Canvas shadows gl={{ antialias: true }} className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 10, 5]} intensity={2} color="#10b981" />
            <pointLight position={[-5, 5, -5]} intensity={1} color="#fbbf24" />

            <GradCap hovered={hovered} />

        </Canvas>
    );
};

export default CyberGradCapScene;
