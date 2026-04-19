import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

import { cn } from "@/lib/utils";

export interface HotelImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  imageClassName?: string;
}

const HotelImageCarousel = ({
  images,
  alt = "",
  className,
  imageClassName,
}: HotelImageCarouselProps) => {
  const resolvedImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbs = resolvedImages.slice(0, 5);

  useEffect(() => {
    setActiveIndex(0);
  }, [resolvedImages.join("|")]);

  if (resolvedImages.length === 0) {
    return null;
  }

  const prev = () =>
    setActiveIndex((index) =>
      index === 0 ? resolvedImages.length - 1 : index - 1,
    );

  const next = () =>
    setActiveIndex((index) =>
      index === resolvedImages.length - 1 ? 0 : index + 1,
    );

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("relative rounded-xl overflow-hidden h-[240px] group", imageClassName)}>
        <img
          src={resolvedImages[activeIndex]}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Photo count badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <Images className="w-3.5 h-3.5" />
          {resolvedImages.length} photos
        </span>

        {/* Nav arrows */}
        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-4 h-4 text-black-80" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-4 h-4 text-black-80" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {resolvedImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Aller à la photo ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {thumbs.length > 1 && (
        <div className="flex gap-2 mt-2">
          {thumbs.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === activeIndex ? "border-gold-100" : "border-transparent"
              }`}
              aria-label={`Aller à la photo ${i + 1}`}
            >
              <img
                src={src}
                alt={`${alt} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelImageCarousel;