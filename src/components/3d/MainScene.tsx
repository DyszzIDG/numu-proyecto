"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { random } from "maath";

const Stars = (props: any) => {
    const ref = useRef<THREE.Points>(null);
    const sphere = useMemo(() => {
        // Generate random points in a sphere
        // using maath for better distribution if available, or manual random
        const data = new Float32Array(5000 * 3);
        // Fallback or use manual filling since maath types might be tricky to import directly sometimes
        for (let i = 0; i < 5000 * 3; i++) {
            data[i] = (Math.random() - 0.5) * 10;
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#6366f1"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const ConnectingLines = () => {
    // A separate layer of slower moving, larger nodes connected by lines conceptually
    // For performance, we'll simulate this with just brighter, larger distinct points
    const ref = useRef<THREE.Points>(null);
    const sphere = useMemo(() => {
        const data = new Float32Array(300 * 3);
        const radius = 4;
        for (let i = 0; i < 300; i++) {
            // Points on sphere surfaceish
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            data[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            data[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            data[i * 3 + 2] = radius * Math.cos(theta);
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta / 20;
            ref.current.rotation.y += delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#06b6d4" // Cyan
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}


const NexusCore = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [active, setActive] = useState(false);

    // Global click listener to trigger the effect
    useEffect(() => {
        const handleClick = () => {
            setActive(true);
            setTimeout(() => setActive(false), 500); // Pulse effect
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Rotation speed depends on active state
            const speed = active ? 5 : 0.5;
            meshRef.current.rotation.x += delta * speed * 0.2;
            meshRef.current.rotation.y += delta * speed;

            // Pulse scale
            const targetScale = active ? 2.5 : 2;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
        }
    });

    return (
        <group position={[0, 0, -2]}>
            {/* Core Shape */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 1]} /> {/* Low poly look */}
                <meshStandardMaterial
                    color={active ? "#a855f7" : "#0f172a"}
                    wireframe
                    emissive={active ? "#d8b4fe" : "#0ea5e9"}
                    emissiveIntensity={active ? 2 : 0.5}
                />
            </mesh>
            {/* Halo / Glow */}
            <mesh scale={[3, 3, 3]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#6366f1" transparent opacity={0.05} wireframe />
            </mesh>
        </group>
    );
};

const MainScene = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
                {/* Deep Background Stars */}
                <Stars />
                {/* Foreground Network Nodes */}
                <ConnectingLines />
                {/* HERO OBJECT: Digital Nexus */}
                <NexusCore />
            </Canvas>
        </div>
    );
};

export default MainScene;
