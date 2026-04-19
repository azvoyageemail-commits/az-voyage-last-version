import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OfferCard from "../ui/OfferCard";
import { useOffers, getOfferImageSrc, getOfferFlagSrc } from "@/hooks/useOffers";
import { useOfferPacks, getOfferPackImageSrc } from "@/hooks/useOfferPacks";
import { BlurFade } from "@/components/magicui/blur-fade";

const OffersSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: cmsOffers, isLoading: isLoadingOffers } = useOffers(undefined, { homepage: true });
  const { data: cmsPacks, isLoading: isLoadingPacks } = useOfferPacks();
  const isLoading = isLoadingOffers || isLoadingPacks;

  /* Map CMS data to the shape OfferCard expects */
  const offers = (cmsOffers ?? []).map((o) => ({
    kind: "offer" as const,
    src: getOfferImageSrc(o),
    name: o.title,
    flag: o.flag ?? "",
    flagSrc: getOfferFlagSrc(o),
    dates: o.dates ?? "",
    duration: o.duration ?? "",
    price: o.price,
    tag: o.tag,
    slug: o.slug,
    href: o.slug ? `/offer/${o.slug}` : undefined,
  }));

  const packs = (cmsPacks ?? []).map((p) => ({
    kind: "pack" as const,
    src: getOfferPackImageSrc(p),
    name: p.title,
    flag: "",
    flagSrc: "",
    dates: p.dates ?? "",
    duration: p.duration ?? "",
    price: p.price,
    tag: p.badge || "Pack combiné",
    slug: p.slug,
    href: p.slug ? `/pack/${p.slug}` : undefined,
    includesFlight: false,
    includesHotel: true,
    includesTransport: false,
  }));

  // Put packs first so they are immediately visible in the horizontal carousel.
  const homeItems = [...packs, ...offers];

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="offres" className="px-6 sm:px-10 lg:px-16 py-20 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        <h2 className="font-jakarta font-bold text-[36px] sm:text-[40px] tracking-[-2px]">
          <span className="text-gold-100">Offres </span>
          <span className="text-black-100">du moment</span>
        </h2>
        <p className="text-black-50 text-lg sm:text-xl leading-[30px] tracking-tight max-w-[620px] lg:text-right">
          Des offres prêtes à partir, avec des détails clairs et un accompagnement jusqu'au départ.
        </p>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[320px] sm:w-[333px] snap-start animate-pulse"
                >
                  <div className="bg-gray-200 rounded-2xl h-[420px]" />
                </div>
              ))
            // : homeItems.map((offer, index) => (
            //     <BlurFade
            //   key={`${offer.kind}-${offer.slug || offer.name}-${index}`}
            //       className="flex-shrink-0 w-[320px] sm:w-[333px] snap-start"
            //       delay={0.14 + index * 0.08}
            //       duration={0.95}
            //       inView
            //     >
            //       <OfferCard {...offer} href={offer.href} />
            //     </BlurFade>
            //   ))}
            : homeItems.map((offer, index) => (
                <BlurFade
                  key={`${offer.kind}-${offer.slug || offer.name}-${index}`}
                  className="flex-shrink-0 w-[320px] sm:w-[333px] snap-start"
                  delay={0.14 + index * 0.08}
                  duration={0.95}
                  inView={typeof window !== "undefined" && window.innerWidth >= 768}
                >
                  <OfferCard {...offer} href={offer.href} />
                </BlurFade>
              ))}
        </div>

        {/* Carousel Navigation Buttons */}
        {/*
        <button
          onClick={() => scroll("left")}
          aria-label="Défiler vers la gauche"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-navy-100 text-white p-2 rounded-full hover:bg-navy-90 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Défiler vers la droite"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-navy-100 text-white p-2 rounded-full hover:bg-navy-90 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        */}
      </div>
    </section>
  );
};

export default OffersSection;
