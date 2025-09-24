'use client';

import { Play } from 'lucide-react';

interface VideoSkeletonProps {
  progress: number;
  shouldLoad: boolean;
}

export const VideoSkeleton = ({ progress, shouldLoad }: VideoSkeletonProps) => {
  return (
    <div className="w-full aspect-[3/2] rounded-lg flex flex-col justify-center items-center">
      <Play className="w-16 h-16 text-primary mb-4" />
      <div className="w-3/4 h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{width: `${progress}%`}}
        />
      </div>
      <span className="text-xs text-primary">
        {shouldLoad ? 'Chargement vidéo...' : 'En attente...'}
      </span>
    </div>
  );
};