"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, ContactShadows, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { random } from "maath";

const BrainParticles = ({ hovered }: { hovered: boolean }) => {
    const ref = useRef<THREE.Points>(null);

    // Generate particles in a rough sphere/brain shape
    const particles = React.useMemo(() => {
        const data = new Float32Array(1500 * 3);
        const radius = 1.2;
        for (let i = 0; i < 1500; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // simple sphere for now as "brain-like"
            data[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            data[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi) * 0.8; // Flatten y slightly
            data[i * 3 + 2] = radius * Math.cos(theta);
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            // Spin faster on hover
            const speed = hovered ? 1 : 0.2;
            ref.current.rotation.y += delta * speed;
            ref.current.rotation.x += delta * speed * 0.3;

            // Expand slightly on hover
            const targetScale = hovered ? 1.5 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={hovered ? "#d8b4fe" : "#a855f7"} // Bright purple on hover
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    emissive={hovered ? "#a855f7" : "#000"}
                />
            </Points>
        </group>
    );
};

const ConnectingSynapses = ({ hovered }: { hovered: boolean }) => {
    const group = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y -= delta * (hovered ? 0.5 : 0.1);
        }
    });

    return (
        <group ref={group}>
            {/* Abstract connections */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.5, 0.02, 16, 100]} />
                <meshStandardMaterial color={hovered ? "#fff" : "#a855f7"} emissive="#a855f7" />
            </mesh>
            <mesh rotation={[1.5, 0, 0]}>
                <torusGeometry args={[1.2, 0.02, 16, 100]} />
                <meshStandardMaterial color={hovered ? "#fff" : "#a855f7"} emissive="#a855f7" />
            </mesh>
        </group>
    )
}

const CyberBrainScene = ({ hovered }: { hovered: boolean }) => {
    return (
        <Canvas shadows gl={{ antialias: true }} className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={hovered ? 2 : 1} color="#a855f7" />

            <BrainParticles hovered={hovered} />
            <ConnectingSynapses hovered={hovered} />

        </Canvas>
    );
};

export default CyberBrainScene;
