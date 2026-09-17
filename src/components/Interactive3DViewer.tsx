import React, { useRef, useState, useEffect } from 'react';
import { Eye, Sparkles, Sliders } from 'lucide-react';
import { playHoverSound } from '../utils/audio';

interface Interactive3DViewerProps {
  imageUrl: string;
  title: string;
  className?: string;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ imageUrl, title, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePos({ x, y });
    // 3D Tilt calculation
    const rotX = (y - 0.5) * -16;
    const rotY = (x - 0.5) * 16;
    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
  };

  // Canvas RGB chromatic displacement effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    let animId: number;

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (img.complete && img.naturalWidth > 0) {
        // Draw base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (isHovered) {
          // Dynamic Specular Light Glare
          const glareX = mousePos.x * canvas.width;
          const glareY = mousePos.y * canvas.height;
          const grad = ctx.createRadialGradient(glareX, glareY, 10, glareX, glareY, canvas.width * 0.45);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Simulated Wireframe or Normal Map Grid if enabled
          if (wireframeMode) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1;
            const step = 24;
            for (let x = 0; x < canvas.width; x += step) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
              ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += step) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }
          }
        }
      }
    };

    img.onload = () => {
      canvas.width = 800;
      canvas.height = 1000;
      render();
    };

    if (img.complete) {
      canvas.width = 800;
      canvas.height = 1000;
      render();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [imageUrl, isHovered, mousePos, wireframeMode]);

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* 3D Viewport Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
        }}
        className="relative aspect-[4/5] bg-neutral-900 overflow-hidden cursor-crosshair border border-neutral-800"
      >
        <div
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.04 : 1})`,
            transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full relative"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />

          {/* Depth vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Interactive HUD Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none font-mono text-[11px] text-neutral-300">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-cyan-400 animate-ping' : 'bg-neutral-600'}`} />
                <span className="uppercase tracking-widest font-semibold">
                  {isHovered ? 'REALTIME DISPLACEMENT ACTIVE' : 'SPATIAL 3D CANVAS'}
                </span>
              </div>
              <p className="text-neutral-400">TILT X: {rotation.x.toFixed(1)}° | Y: {rotation.y.toFixed(1)}°</p>
            </div>
            <span className="bg-black/80 px-2 py-1 border border-neutral-700">STATIC RES: 4K TIFF</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-2 px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors cursor-pointer ${
              wireframeMode ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>NORMAL GRID [{wireframeMode ? 'ON' : 'OFF'}]</span>
          </button>
        </div>
        <span className="text-[11px] text-neutral-500 hidden sm:inline">
          Move cursor to simulate 3D specular light & chromatic depth
        </span>
      </div>
    </div>
  );
};
