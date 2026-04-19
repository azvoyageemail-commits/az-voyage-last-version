import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface OfferGalleryProps {
  images: string[];
  alt?: string;
}

const OfferGallery = ({ images, alt = "" }: OfferGalleryProps) => {
  const resolvedImages = images.filter(Boolean);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    if (!viewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && resolvedImages.length > 1) {
        setViewerIndex((index) =>
          index === 0 ? resolvedImages.length - 1 : index - 1,
        );
      }

      if (event.key === "ArrowRight" && resolvedImages.length > 1) {
        setViewerIndex((index) =>
          index === resolvedImages.length - 1 ? 0 : index + 1,
        );
      }

      if (event.key === "Escape") {
        setViewerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerOpen, resolvedImages.length]);

  if (resolvedImages.length === 0) return null;

  const mainImage = resolvedImages[0];
  const sideImages = resolvedImages.slice(1, 4);
  const totalPhotos = resolvedImages.length;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const prevViewerImage = () =>
    setViewerIndex((index) =>
      index === 0 ? resolvedImages.length - 1 : index - 1,
    );

  const nextViewerImage = () =>
    setViewerIndex((index) =>
      index === resolvedImages.length - 1 ? 0 : index + 1,
    );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 rounded-2xl">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={() => openViewer(0)}
            className="absolute inset-0 z-10"
            aria-label="Ouvrir la galerie photo"
          />
          <img
            src={mainImage}
            
            alt={alt}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => openViewer(0)}
            className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-black text-sm font-medium tracking-tight px-4 py-2.5 rounded-full hover:bg-white transition-colors shadow-md"
          >
            <Images className="w-4 h-4" />
            Voir toutes les photos ({totalPhotos})
          </button>
        </div>

        <div className="hidden lg:grid lg:grid-rows-3 gap-3 h-[440px]">
          {sideImages.map((src, i) => {
            const imageIndex = i + 1;

            return (
              <button
                key={src}
                type="button"
                onClick={() => openViewer(imageIndex)}
                className="relative h-full overflow-hidden rounded-2xl"
                aria-label={`Ouvrir la photo ${imageIndex + 1}`}
              >
                <img
                  src={src}
                  alt={`${alt} ${imageIndex + 1}`}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                />
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-0 text-white overflow-hidden rounded-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">Galerie photo</DialogTitle>

          <div className="relative flex flex-col bg-black">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/80">
              <span>{alt || "Galerie photo"}</span>
              <span>
                {viewerIndex + 1} / {resolvedImages.length}
              </span>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[80vh]">
              <img
                src={resolvedImages[viewerIndex]}
                alt={`${alt} ${viewerIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {resolvedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevViewerImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-black shadow-lg transition-all hover:bg-gold-80 hover:scale-110 active:scale-95"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextViewerImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-black shadow-lg transition-all hover:bg-gold-80 hover:scale-110 active:scale-95"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setViewerOpen(false)}
                className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-black shadow-lg transition-all hover:bg-gold-80 hover:scale-110 active:scale-95"
                aria-label="Fermer la galerie"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfferGallery;
