import React from 'react';

interface WaveDividerProps {
    className?: string;
    position?: 'top' | 'bottom';
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
    className = "",
    position = "bottom",
}) => {
    return (
        <div className={`absolute left-0 w-full overflow-hidden leading-none z-10 ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}>
            <svg
                viewBox="0 0 1440 320"
                className="relative block w-[calc(110%+1.3px)] h-[120px] sm:h-[180px]"
                preserveAspectRatio="none"
            >
                {/* Gold Layer (Back) */}
                <path
                    fill="#facc15"
                    fillOpacity="1"
                    d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>

                {/* White Layer (Front - Main Divider) */}
                <path
                    fill="#ffffff"
                    fillOpacity="1"
                    d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,245.3C672,256,768,256,864,240C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </svg>
        </div>
    );
};
