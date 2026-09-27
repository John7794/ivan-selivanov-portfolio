import React from 'react';

interface Interactive3DViewerProps {
  imageUrl: string;
  title: string;
  className?: string;
}

export const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ imageUrl, title, className = '' }) => {
  return (
    <div className={`relative flex flex-col bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden p-2 sm:p-4 ${className}`}>
      <div className="w-full flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="eager"
          decoding="async"
          className="max-h-[76vh] w-auto max-w-full h-auto object-contain block mx-auto shadow-2xl rounded-sm"
        />
      </div>
    </div>
  );
};
