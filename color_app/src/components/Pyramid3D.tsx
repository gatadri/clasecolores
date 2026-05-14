import React, { useRef, useEffect } from 'react';
import './../styles/ColorHarmonizer.scss';

interface Props { hue: number; }

const Pyramid3D: React.FC<Props> = ({ hue }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleRef = useRef(0);
    const rafRef = useRef<number>(0);
    const colorsRef = useRef<string[]>([]);

    const labels = ['Base', 'Complementario', 'Triada A', 'Triada B'];

    colorsRef.current = [
        `hsl(${hue}, 70%, 50%)`,
        `hsl(${(hue + 180) % 360}, 70%, 50%)`,
        `hsl(${(hue + 120) % 360}, 70%, 50%)`,
        `hsl(${(hue + 240) % 360}, 70%, 50%)`,
    ];

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width;
        const H = canvas.height;
        const cx = W / 2;
        const cy = H / 2;
        const s = 80;

        const project = (x: number, y: number, z: number, angle: number) => {
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const rx = x * cosA - z * sinA;
            const rz = x * sinA + z * cosA;
            const scale = 400 / (400 + rz);
            return { sx: cx + rx * scale, sy: cy + y * scale, z: rz };
        };

        // 8 vertices del cubo
        const verts = [
            { x: -s, y: -s, z: -s }, { x:  s, y: -s, z: -s },
            { x:  s, y:  s, z: -s }, { x: -s, y:  s, z: -s },
            { x: -s, y: -s, z:  s }, { x:  s, y: -s, z:  s },
            { x:  s, y:  s, z:  s }, { x: -s, y:  s, z:  s },
        ];

        // 6 caras: [indices de vertices, indice de color (-1 = top/bottom)]
        const faces = [
            { vi: [4, 5, 6, 7], ci: 0 }, // frente
            { vi: [1, 0, 3, 2], ci: 1 }, // atrás
            { vi: [5, 1, 2, 6], ci: 2 }, // derecha
            { vi: [0, 4, 7, 3], ci: 3 }, // izquierda
            { vi: [0, 1, 5, 4], ci: -1 }, // arriba
            { vi: [3, 7, 6, 2], ci: -1 }, // abajo
        ];

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            const a = angleRef.current;
            const pv = verts.map(v => project(v.x, v.y, v.z, a));

            const sorted = faces.map(f => {
                const midZ = f.vi.reduce((acc, i) => acc + pv[i].z, 0) / 4;
                return { ...f, midZ };
            }).sort((a, b) => b.midZ - a.midZ);

            sorted.forEach(({ vi, ci, midZ: _ }) => {
                const pts = vi.map(i => pv[i]);
                ctx.beginPath();
                ctx.moveTo(pts[0].sx, pts[0].sy);
                pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
                ctx.closePath();

                const color = ci === -1 ? 'rgba(30,30,30,0.6)' : colorsRef.current[ci];
                ctx.fillStyle = color;
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

    return (
        <section className="pyramid-section">
            <h3>Cubo 3D</h3>
            <canvas ref={canvasRef} width={320} height={320} />
        </section>
    );
};

export default Pyramid3D;
