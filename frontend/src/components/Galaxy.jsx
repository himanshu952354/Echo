import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
// import * as random from "maath/random/dist/maath-random.esm"; // Avoiding dependency issues

// Custom hook to generate star positions
function generateStars(count = 5000, radius = 1.2) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        // Spread stars in a sphere/galaxy shape
        // Using a simple spherical distribution for a "star field" look which is often what "galaxy" backgrounds look like
        // For a spiral, we'd need more complex math, but a dense starfield is usually cleaner for UI backgrounds
        positions[i * 3] = (Math.random() - 0.5) * 2 * radius;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * radius; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * radius; // z
    }
    return positions;
}

const StarField = (props) => {
    const ref = useRef();
    const [sphere] = useState(() => {
        // Generate random points in a sphere associated with the radius
        const pts = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            // Random point in sphere
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = 1.2 * Math.cbrt(Math.random()); // Cubic root for uniform distribution

            pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pts[i * 3 + 2] = r * Math.cos(phi);
        }
        return pts;
    });

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const Galaxy = () => {
    return (
        <div className="w-full h-full absolute inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <StarField />
                    <Preload all />
                </Suspense>
            </Canvas>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>
    );
};

export default Galaxy;
