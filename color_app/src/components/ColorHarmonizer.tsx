import React from 'react';
import './../styles/ColorHarmonizer.scss';

interface Props { hue: number; setHue: (h: number) => void; }

const ColorHarmonizer: React.FC<Props> = ({ hue, setHue }) => {
    const getHarmonies = (h: number) => [
        { type: 'Base', val: `hsl(${h}, 70%, 50%)` },
        { type: 'Complementario', val: `hsl(${(h + 180) % 360}, 70%, 50%)` },
        { type: 'Triada A', val: `hsl(${(h + 120) % 360}, 70%, 50%)` },
        { type: 'Triada B', val: `hsl(${(h + 240) % 360}, 70%, 50%)` },
    ];

    return (
        <section className="harmonies">
            <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHue(Number(e.target.value))
                }
            />

            <div className="grid">
                {getHarmonies(hue).map((c) => (
                    <div
                        key={c.type}
                        className="harmony"
                        style={{ backgroundColor: c.val }}
                    >
                        <span>{c.type}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ColorHarmonizer;
