import React from 'react';

export default function Hero3D() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 opacity-40 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-rose-900 animate-gradient-shift"></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-600/30 rounded-full blur-[100px] animate-float-delayed"></div>
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] animate-pulse-slow"></div>

            {/* Geometric Patterns */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-400/30" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" className="animate-grid-move" />
                </svg>
            </div>

            {/* Particle Effect */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Add custom animations to global CSS */}
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(5deg) scale(1.1); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-40px, 40px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.2); }
                }
                @keyframes particle {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
                }
                @keyframes grid-move {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(40px, 40px); }
                }
                .animate-gradient-shift {
                    animation: gradient-shift 20s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 18s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 12s ease-in-out infinite;
                }
                .animate-particle {
                    animation: particle linear infinite;
                }
                .animate-grid-move {
                    animation: grid-move 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
