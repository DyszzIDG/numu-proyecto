"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, TorusKnot, Icosahedron, Box } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
    section: string;
}

const AnimatedGroup = ({ targetScale, children }: { targetScale: number, children: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
        }
    });

    return <group ref={groupRef}>{children}</group>;
};

const KnowledgeObject = ({ section }: { section: string }) => {
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* CRECK: CRYSTAL (Icosahedron) */}
                <AnimatedGroup targetScale={section === "CRECK" ? 1 : 0}>
                    <Icosahedron args={[1.5, 0]}>
                        <meshPhysicalMaterial
                            color="#10b981"
                            roughness={0}
                            metalness={0.8}
                            transmission={0.5}
                            thickness={2}
                            clearcoat={1}
                        />
                    </Icosahedron>
                    <mesh scale={0.8}>
                        <icosahedronGeometry args={[1.2, 0]} />
                        <meshBasicMaterial color="#34d399" wireframe />
                    </mesh>
                </AnimatedGroup>

                {/* MOODLE: LIBRARY (Stack of Books/Boxes) */}
                <AnimatedGroup targetScale={section === "MOODLE" ? 1 : 0}>
                    <Box args={[2, 0.4, 1.5]} position={[0, -0.4, 0]}>
                        <meshStandardMaterial color="#0d9488" roughness={0.3} metalness={0.6} />
                    </Box>
                    <Box args={[1.8, 0.4, 1.4]} position={[0.2, 0.1, 0]} rotation={[0, 0.2, 0]}>
                        <meshStandardMaterial color="#14b8a6" roughness={0.3} metalness={0.6} />
                    </Box>
                    <Box args={[1.6, 0.4, 1.3]} position={[-0.2, 0.6, 0]} rotation={[0, -0.1, 0]}>
                        <meshStandardMaterial color="#2dd4bf" roughness={0.3} metalness={0.6} />
                    </Box>
                </AnimatedGroup>

                {/* CTF: PUZZLE (Torus Knot) */}
                <AnimatedGroup targetScale={section === "CTF" ? 1 : 0}>
                    <TorusKnot args={[0.8, 0.2, 100, 16]} position={[0, 0, 0]}>
                        <meshStandardMaterial
                            color="#06b6d4"
                            emissive="#0891b2"
                            emissiveIntensity={0.5}
                            roughness={0.2}
                            metalness={1}
                        />
                    </TorusKnot>
                </AnimatedGroup>

                {/* IDLE PARTICLES */}
                <AnimatedGroup targetScale={section === "IDLE" ? 1 : 0}>
                    <points>
                        <sphereGeometry args={[2, 32, 32]} />
                        <pointsMaterial size={0.05} color="#cbd5e1" transparent opacity={0.5} />
                    </points>
                </AnimatedGroup>
            </Float>
        </group>
    );
};

const EducationScene = ({ section }: SceneProps) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas shadows gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#10b981" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#06b6d4" />
                <spotLight position={[0, 5, 0]} intensity={0.8} />
                <KnowledgeObject section={section} />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
};

export default EducationScene;
