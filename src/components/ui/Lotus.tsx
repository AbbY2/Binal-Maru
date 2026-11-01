const PETALS = [-72, -48, -24, 0, 24, 48, 72];

/** Line-drawn lotus used as the brand mark. `draw` animates the strokes in. */
export const Lotus: React.FC<{ className?: string; draw?: boolean }> = ({ className, draw }) => (
  <svg viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className={className} aria-hidden="true">
    {PETALS.map((angle, i) => (
      <path
        key={angle}
        d="M32 40C25 30 25 16 32 6C39 16 39 30 32 40Z"
        pathLength={1}
        transform={`rotate(${angle} 32 40)`}
        style={draw ? {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: `lotus-draw 1.2s ${i * 0.09}s cubic-bezier(.65,0,.35,1) forwards`,
        } : undefined}
      />
    ))}
    {draw && <style>{'@keyframes lotus-draw { to { stroke-dashoffset: 0; } }'}</style>}
  </svg>
);
