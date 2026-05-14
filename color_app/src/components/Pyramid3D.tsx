import React, { useRef, useEffect, useState } from 'react';
import './../styles/ColorHarmonizer.scss';

interface CubeProps { hue: number; }

const labels = ['Base', 'Complementario', 'Triada A', 'Triada B'];

const getColors = (h: number) => [
    `hsl(${h}, 70%, 50%)`,
    `hsl(${(h + 180) % 360}, 70%, 50%)`,
    `hsl(${(h + 120) % 360}, 70%, 50%)`,
    `hsl(${(h + 240) % 360}, 70%, 50%)`,
];

const CubeCanvas: React.FC<CubeProps> = ({ hue }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleRef = useRef(0);
    const rafRef = useRef<number>(0);
    const colorsRef = useRef<string[]>(getColors(hue));

    colorsRef.current = getColors(hue);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2, s = 80;

        const project = (x: number, y: number, z: number, angle: number) => {
            const cosA = Math.cos(angle), sinA = Math.sin(angle);
            const rx = x * cosA - z * sinA;
            const rz = x * sinA + z * cosA;
            const scale = 400 / (400 + rz);
            return { sx: cx + rx * scale, sy: cy + y * scale, z: rz };
        };

        const verts = [
            { x: -s, y: -s, z: -s }, { x:  s, y: -s, z: -s },
            { x:  s, y:  s, z: -s }, { x: -s, y:  s, z: -s },
            { x: -s, y: -s, z:  s }, { x:  s, y: -s, z:  s },
            { x:  s, y:  s, z:  s }, { x: -s, y:  s, z:  s },
        ];

        const faces = [
            { vi: [4, 5, 6, 7], ci: 0 },
            { vi: [1, 0, 3, 2], ci: 1 },
            { vi: [5, 1, 2, 6], ci: 2 },
            { vi: [0, 4, 7, 3], ci: 3 },
            { vi: [0, 1, 5, 4], ci: -1 },
            { vi: [3, 7, 6, 2], ci: -1 },
        ];

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const a = angleRef.current;
            const pv = verts.map(v => project(v.x, v.y, v.z, a));

            faces.map(f => ({
                ...f,
                midZ: f.vi.reduce((acc, i) => acc + pv[i].z, 0) / 4,
            }))
            .sort((a, b) => b.midZ - a.midZ)
            .forEach(({ vi, ci }) => {
                const pts = vi.map(i => pv[i]);
                ctx.beginPath();
                ctx.moveTo(pts[0].sx, pts[0].sy);
                pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
                ctx.closePath();
                ctx.fillStyle = ci === -1 ? 'rgba(30,30,30,0.6)' : colorsRef.current[ci];
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                if (ci !== -1) {
                    const lx = pts.reduce((acc, p) => acc + p.sx, 0) / 4;
                    const ly = pts.reduce((acc, p) => acc + p.sy, 0) / 4;
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.font = 'bold 11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(labels[ci], lx, ly);
                }
            });

            angleRef.current += 0.01;
            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return <canvas ref={canvasRef} width={320} height={320} />;
};

const Pyramid3D: React.FC<{ hue: number }> = ({ hue }) => {
    const [randomHue, setRandomHue] = useState(() => Math.floor(Math.random() * 360));

    useEffect(() => {
        const interval = setInterval(() => {
            setRandomHue(Math.floor(Math.random() * 360));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <section className="pyramid-section">
                <h3>Cubo 3D</h3>
                <CubeCanvas hue={hue} />
            </section>
            <section className="pyramid-section">
                <h3>Cubo Aleatorio</h3>
                <CubeCanvas hue={randomHue} />
            </section>
        </>
    );
};

export default Pyramid3D;
