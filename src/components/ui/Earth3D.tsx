"use client";
import React, { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

// Helper to convert Lat/Lon to 3D position
const calcPosFromLatLonRad = (lat: number, lon: number, radius: number = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return [x, y, z] as [number, number, number];
};

interface OfficeLocation {
    name: string;
    lat: number;
    lon: number;
}

const offices: OfficeLocation[] = [
    { name: "Madrid", lat: 40.4168, lon: -3.7038 },
    { name: "Managua", lat: 12.1364, lon: -86.2514 },
    { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
    { name: "Bogotá", lat: 4.7110, lon: -74.0721 },
    { name: "Panama City", lat: 8.9824, lon: -79.5199 },
    { name: "San Salvador", lat: 13.6929, lon: -89.2182 },
    { name: "Santo Domingo", lat: 18.4861, lon: -69.9312 },
    { name: "Quito", lat: -0.1807, lon: -78.4678 },
    { name: "Washington D.C.", lat: 38.9072, lon: -77.0369 },
];

const Earth3D: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [colorMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
    ]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15; // Animation speed
        }
    });

    const markers = useMemo(() => {
        return offices.map((office, i) => {
            const [x, y, z] = calcPosFromLatLonRad(office.lat, office.lon, 1.55); // Radius to sit above surface
            return (
                <group key={i} position={[x, y, z]}>
                    <mesh>
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
                    </mesh>
                    <Html distanceFactor={10}>
                        <div className="pointer-events-none select-none text-xs text-cyber-primary font-mono bg-black/50 px-1 border border-cyber-primary/30 rounded backdrop-blur-sm whitespace-nowrap transform translate-x-2 -translate-y-2">
                            {office.name}
                        </div>
                    </Html>
                </group>
            );
        });
    }, []);

    return (
        <group ref={groupRef} rotation={[0.2, 0, 0]}>
            {/* Main Earth Sphere - Textured */}
            <Sphere args={[1.5, 64, 64]}>
                <meshPhongMaterial
                    map={colorMap}
                    color="#ffffff"
                    emissive="#000000"
                    specular="#333333"
                    shininess={5}
                />
            </Sphere>

            {/* Atmosphere/Wireframe Overlay */}
            <Sphere args={[1.51, 64, 64]}>
                <meshBasicMaterial
                    color="#00f0ff"
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </Sphere>

            {markers}
        </group>
    );
};

export default Earth3D;
