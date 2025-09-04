import React from 'react';
import adaaptLogo from 'figma:asset/7f23da1575b49f314d0beabc5085683deab7d512.png';

interface AdaaptLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdaaptLogo({ className = '', size = 'md' }: AdaaptLogoProps) {
  const sizeClasses = {
    sm: 'h-6', // Height-based sizing to maintain aspect ratio (24px)
    md: 'h-8', // 32px
    lg: 'h-12', // 48px - standard size for login
    xl: 'h-24' // 96px - premium login size
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src={adaaptLogo}
        alt="adaapt"
        className="h-full w-auto"
        style={{
          imageRendering: '-webkit-optimize-contrast', // Ensure crisp rendering
          WebkitImageSmoothing: true,
          // Ensure fixed width & height with center constraints as specified
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}