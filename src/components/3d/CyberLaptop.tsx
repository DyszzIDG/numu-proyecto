"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Text, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const ScreenText = ({ hovered }: { hovered: boolean }) => {
    const [text, setText] = useState("Scan...");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (hovered) {
            setText("CONNECTING...");
            timeout = setTimeout(() => setText("ACCESS GRANTED\n> SYSTEM CONNECTED"), 800);
        } else {
            setText("SYSTEM SECURE\nWAITING...");
        }
        return () => clearTimeout(timeout);
    }, [hovered]);

    return (
        <Text
            position={[0, 0.1, 0.06]}
            fontSize={0.1}
            color={hovered ? "#06b6d4" : "#64748b"} // Cyan if connected, Slate if waiting
            anchorX="center"
            anchorY="middle"
        >
            {text}
        </Text>
    );
};

const Laptop = ({ hovered }: { hovered: boolean }) => {
    const group = useRef<THREE.Group>(null);
    const screenRef = useRef<THREE.Group>(null);

    // Animation Refs
    const lidsAngle = useRef(0);

    useFrame((state, delta) => {
        if (!group.current || !screenRef.current) return;

        // IDLE Animation: Float and rotate slightly
        // HOVER Animation: Rotate to front (0,0,0) and Scale UP (Simulate zoom)

        const targetScale = hovered ? 3 : 1.2;
        const targetRotX = hovered ? 0.2 : 0.3; // Tilt up slightly on hover to face camera
        const targetRotY = hovered ? 0 : -0.5; // Face forward on hover
        const targetY = hovered ? -0.5 : 0;

        // Lerp transforms
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, delta * 4);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, delta * 4);
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, delta * 4);

        // Open/Close lid slightly? Keep open for now.
    });

    return (
        <group ref={group}>
            <Float speed={hovered ? 0 : 2} rotationIntensity={hovered ? 0 : 0.4} floatIntensity={hovered ? 0 : 0.5}>

                {/* BASE */}
                <mesh position={[0, -0.5, 0]}>
                    <boxGeometry args={[2, 0.1, 1.5]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* SCREEN HINGE GROUP */}
                <group position={[0, -0.45, -0.7]} rotation={[-0.2, 0, 0]}>
                    {/* Screen Case */}
                    <mesh position={[0, 0.75, 0]}>
                        <boxGeometry args={[2, 1.5, 0.1]} />
                        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Screen Display Panel */}
                    <mesh position={[0, 0.75, 0.051]}>
                        <planeGeometry args={[1.8, 1.3]} />
                        <meshBasicMaterial color="black" />
                    </mesh>
                    {/* TEXT CONTENT */}
                    <group position={[0, 0.75, 0.01]}>
                        <ScreenText hovered={hovered} />
                    </group>
                </group>

                {/* Keyboard Area (Texture/Details simplified) */}
                <mesh position={[0, -0.44, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1.8, 0.8]} />
                    <meshBasicMaterial color="#334155" />
                </mesh>

            </Float>
        </group>
    );
};

const CyberLaptopScene = ({ hovered }: { hovered: boolean }) => {
    return (
        <Canvas shadows gl={{ antialias: true }} className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <ambientLight intensity={1} />
            <pointLight position={[5, 10, 10]} intensity={2} color="#06b6d4" />
            <pointLight position={[-5, 5, 5]} intensity={1} color="#6366f1" />

            <Laptop hovered={hovered} />

            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2.5} far={4} color="#06b6d4" />
        </Canvas>
    );
};

export default CyberLaptopScene;
