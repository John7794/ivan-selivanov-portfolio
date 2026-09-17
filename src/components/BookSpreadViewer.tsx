import React from 'react';

interface BookSpreadViewerProps {
  imageUrl: string;
  className?: string;
}

export const BookSpreadViewer: React.FC<BookSpreadViewerProps> = ({ imageUrl, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Spread Viewport */}
      <div className="relative aspect-[16/10] bg-[#f2f1eb] border border-neutral-800 text-neutral-900 overflow-hidden shadow-2xl select-none">
        {/* Background Image / Render */}
        <img
          src={imageUrl}
          alt="Book spread"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-95"
        />

        {/* Central Book Spine Fold */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-neutral-400/60 shadow-[0_0_15px_rgba(0,0,0,0.25)] z-20" />

        {/* Pre-press Trim Marks (Crop Marks) */}
        <div className="absolute inset-4 pointer-events-none border border-neutral-400/40 z-20">
          <div className="absolute -top-3 -left-3 w-4 h-[1px] bg-neutral-600" />
          <div className="absolute -top-3 -left-3 h-4 w-[1px] bg-neutral-600" />
          <div className="absolute -top-3 -right-3 w-4 h-[1px] bg-neutral-600" />
          <div className="absolute -top-3 -right-3 h-4 w-[1px] bg-neutral-600" />
          <div className="absolute -bottom-3 -left-3 w-4 h-[1px] bg-neutral-600" />
          <div className="absolute -bottom-3 -left-3 h-4 w-[1px] bg-neutral-600" />
          <div className="absolute -bottom-3 -right-3 w-4 h-[1px] bg-neutral-600" />
          <div className="absolute -bottom-3 -right-3 h-4 w-[1px] bg-neutral-600" />
        </div>

        {/* Prepress Technical Metadata Badge */}
        <div className="absolute bottom-4 left-6 z-30 font-mono text-[10px] bg-white/90 backdrop-blur-md px-2.5 py-1.5 border border-neutral-300 shadow-sm text-neutral-800">
          <span className="font-bold text-neutral-900 mr-2">● EDITORIAL EDITION</span>
          FORMAT: 210 × 280 mm | 11PT BASELINE | ARTISAN PRESS
        </div>
      </div>
    </div>
  );
};
