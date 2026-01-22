
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const WatermarkOverlay: React.FC = () => {
    const { user } = useAppContext();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Subtle movement to prevent easy removal algorithms
        const interval = setInterval(() => {
            setPosition({
                x: Math.random() * 50,
                y: Math.random() * 50
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!user) return null;

    const watermarkText = `${user.firstName} ${user.lastName} - ${user.phone || user.code}`;

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
            style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='200' width='200'><text transform='translate(20, 100) rotate(-45)' fill='rgba(0,0,0,0.03)' font-size='20' font-family='Arial'>${encodeURIComponent(watermarkText)}</text></svg>")`,
                backgroundPosition: `${position.x}px ${position.y}px`
            }}
        />
    );
};

export default WatermarkOverlay;
