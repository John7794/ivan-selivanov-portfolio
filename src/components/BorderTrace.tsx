import React from 'react';

interface BorderTraceProps {
  isHovered?: boolean;
  color?: string;
  className?: string;
}

/**
 * Perimeter Border Trace effect matching the signature ProjectCard hover animation.
 * When hovered, a subtle perimeter line traces smoothly around all 4 edges in sequence:
 * Top (0ms) -> Right (150ms) -> Bottom (300ms) -> Left (450ms).
 * Works either with an explicit `isHovered` boolean or automatically via CSS `group-hover`.
 */
export const BorderTrace: React.FC<BorderTraceProps> = ({
  isHovered,
  color = 'bg-neutral-500',
  className = '',
}) => {
  const isControlled = typeof isHovered === 'boolean';

  const topClass = isControlled
    ? isHovered ? 'scale-x-100' : 'scale-x-0'
    : 'scale-x-0 group-hover:scale-x-100';

  const rightClass = isControlled
    ? isHovered ? 'scale-y-100' : 'scale-y-0'
    : 'scale-y-0 group-hover:scale-y-100';

  const bottomClass = isControlled
    ? isHovered ? 'scale-x-100' : 'scale-x-0'
    : 'scale-x-0 group-hover:scale-x-100';

  const leftClass = isControlled
    ? isHovered ? 'scale-y-100' : 'scale-y-0'
    : 'scale-y-0 group-hover:scale-y-100';

  const topDelayStyle = isControlled
    ? { transitionDelay: isHovered ? '0ms' : '450ms' }
    : undefined;

  const rightDelayStyle = isControlled
    ? { transitionDelay: isHovered ? '150ms' : '300ms' }
    : undefined;

  const bottomDelayStyle = isControlled
    ? { transitionDelay: isHovered ? '300ms' : '150ms' }
    : undefined;

  const leftDelayStyle = isControlled
    ? { transitionDelay: isHovered ? '450ms' : '0ms' }
    : undefined;

  return (
    <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${className}`} aria-hidden="true">
      {/* Top line (left to right) */}
      <span
        className={`absolute top-0 left-0 h-[1px] w-full ${color} transform origin-left transition-transform duration-300 ease-out ${topClass} ${
          !isControlled ? 'delay-[450ms] group-hover:delay-0' : ''
        }`}
        style={topDelayStyle}
      />
      {/* Right line (top to bottom) */}
      <span
        className={`absolute top-0 right-0 w-[1px] h-full ${color} transform origin-top transition-transform duration-300 ease-out ${rightClass} ${
          !isControlled ? 'delay-[300ms] group-hover:delay-[150ms]' : ''
        }`}
        style={rightDelayStyle}
      />
      {/* Bottom line (right to left) */}
      <span
        className={`absolute bottom-0 right-0 h-[1px] w-full ${color} transform origin-right transition-transform duration-300 ease-out ${bottomClass} ${
          !isControlled ? 'delay-[150ms] group-hover:delay-[300ms]' : ''
        }`}
        style={bottomDelayStyle}
      />
      {/* Left line (bottom to top) */}
      <span
        className={`absolute bottom-0 left-0 w-[1px] h-full ${color} transform origin-bottom transition-transform duration-300 ease-out ${leftClass} ${
          !isControlled ? 'delay-0 group-hover:delay-[450ms]' : ''
        }`}
        style={leftDelayStyle}
      />
    </div>
  );
};
