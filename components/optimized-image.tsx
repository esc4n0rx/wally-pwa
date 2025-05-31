import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function OptimizedImage({ src, alt, className, fill, sizes }: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageSrc('/placeholder.svg');
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        quality={85}
        priority={false}
      />
    </div>
  );
}