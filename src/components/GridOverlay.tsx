import React from 'react';

interface GridOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between select-none">
      {/* 12-Column Swiss Modular Grid */}
      <div className="w-full h-full max-w-[1700px] mx-auto px-6 lg:px-12 grid grid-cols-6 md:grid-cols-12 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`h-full border-x border-red-500/20 bg-red-500/[0.03] flex flex-col justify-between py-6 ${
              i >= 6 ? 'hidden md:flex' : 'flex'
            }`}
          >
            <span className="text-[10px] font-mono text-red-500/70 font-semibold px-1">
              COL_{i + 1 < 10 ? `0${i + 1}` : i + 1}
            </span>
            <div className="w-full border-t border-red-500/20 my-auto"></div>
            <span className="text-[10px] font-mono text-red-500/70 font-semibold px-1">
              MOD_8PX
            </span>
          </div>
        ))}
      </div>

      {/* Floating status pill */}
      <div className="pointer-events-auto fixed bottom-6 right-6 bg-[#0a0a0a] text-red-400 border border-red-500/40 px-4 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-3 shadow-2xl z-50">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <span>SWISS 12-COL GRID ACTIVE</span>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white ml-2 underline cursor-pointer"
        >
          [ESC / HIDE]
        </button>
      </div>
    </div>
  );
};
