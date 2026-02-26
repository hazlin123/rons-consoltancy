import React from 'react';

interface GlassWaveProps {
    className?: string;
    position?: 'top' | 'bottom';
}

export const GlassWave: React.FC<GlassWaveProps> = ({
    className = "",
    position = "bottom",
}) => {
    return (
        <div className={`absolute left-0 w-full overflow-hidden leading-none z-20 ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}>
            <svg
                viewBox="0 0 1440 320"
                className="relative block w-[calc(110%+1.3px)] h-[150px] sm:h-[220px]"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                    </filter>
                    <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                    </linearGradient>
                </defs>

                {/* Deep Layer - Darker Blue for depth */}
                <path
                    fill="#0f294d"
                    fillOpacity="0.8"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>

                {/* Frosted Layer - Blurred White */}
                <path
                    fill="url(#glass-gradient)"
                    filter="url(#glass-blur)"
                    d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>

                {/* Crisp Glass Border - Thin White Line */}
                <path
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                    d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,245.3C672,256,768,256,864,240C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </svg>
        </div>
    );
};
