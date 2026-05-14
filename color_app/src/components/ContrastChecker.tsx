import React, { useState } from "react";

const ContrastChecker: React.FC = () => {
    const [bgColor, setBgColor] = useState<string>('#646cff');
    return (
        <section className="contrast-tool">
            <h3> Prueba Contraste</h3>
            <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
            />
            <div className="preview-box" style={{ backgroundColor: bgColor }}>
                <p style={{ color: '#000000' }}> texto negro </p>
                <p style={{ color: '#ffffff' }}> texto blanco </p>
            </div>
                
        </section>
    )
};
export default ContrastChecker