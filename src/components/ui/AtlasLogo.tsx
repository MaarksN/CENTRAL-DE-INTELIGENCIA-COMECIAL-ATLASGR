export function AtlasLogo({ className = "w-10 h-10", color = "currentColor" }: { className?: string, color?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Parallelogram */}
            <path d="M 15 80 L 45 20 L 65 20 L 35 80 Z" fill={color} />
            {/* Triangle */}
            <path d="M 45 80 L 65 40 L 85 80 Z" fill={color} />
        </svg>
    );
}
