import React from 'react';

interface BookSpreadViewerProps {
  imageUrl: string;
  className?: string;
}

export const BookSpreadViewer: React.FC<BookSpreadViewerProps> = ({ imageUrl, className = '' }) => {
  return (
    <div className={`relative flex flex-col bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden p-2 sm:p-4 ${className}`}>
      <div className="w-full flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Visual design"
          loading="eager"
          decoding="async"
          className="max-h-[76vh] w-auto max-w-full h-auto object-contain block mx-auto shadow-2xl rounded-sm"
        />
      </div>
    </div>
  );
};
