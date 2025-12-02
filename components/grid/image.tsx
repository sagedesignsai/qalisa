/**
 * Image Component (Grid Version)
 * Simple image component for grid system
 */

'use client';

import React from 'react';
import Image from 'next/image';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const ImageComponent = ({ 
  src = '', 
  alt = 'Image', 
  width = 400,
  height = 300,
  objectFit = 'cover',
}: ImageProps) => {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center border-2 border-dashed border-muted-foreground/50 bg-muted/20"
        style={{ width, height }}
      >
        <span className="text-sm text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit }}
        className="w-full h-full"
      />
    </div>
  );
};

