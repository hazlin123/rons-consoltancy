import React from 'react';

interface CloudDividerProps {
    className?: string;
    position?: 'top' | 'bottom';
    fill?: string;
    height?: string;
}

export const CloudDivider: React.FC<CloudDividerProps> = ({
    className = "",
    position = "bottom",
    fill = "currentColor",
    height = "80px"
}) => {
    return (
        <div className={`absolute left-0 w-full overflow-hidden leading-none z-20 ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}>
            {/* Use a simple cloud/wave SVG shape */}
            {/* This pattern mimics a soft cloud layer */}
            <svg
                viewBox="0 0 1440 320"
                className="relative block w-[calc(110%+1.3px)]"
                style={{ height: height }}
                preserveAspectRatio="none"
            >
                <path
                    fill={fill}
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
                {/* Added a second semi-transparent layer for depth if needed, but keeping simple for now */}
            </svg>
        </div>
    );
};
