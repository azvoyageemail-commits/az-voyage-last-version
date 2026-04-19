import { Plane, CalendarDays, Clock3, Building2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Footer from "@/components/sections/Footer";
import HotelImageCarousel from "@/components/ui/HotelImageCarousel";
import OfferInclusions from "@/components/ui/OfferInclusions";
import OfferGallery from "@/components/ui/OfferGallery";
import OfferProgram from "@/components/ui/OfferProgram";
import ReservationForm, { type PricingBreakdown } from "@/components/ui/ReservationForm";
import {
  getOfferPackGalleryUrls,
  getPackHotelImageUrls,
  useOfferPack,
} from "@/hooks/useOfferPacks";
import { usePageMeta } from "@/hooks/usePageMeta";

const parsePriceAmount = (value?: string) => {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

const formatDateLabel = (value?: string) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Témoignages", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
  { label: "Gallerie", href: "/gallerie" },
];

export default function OfferPackDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pack, isLoading } = useOfferPack(id ?? "");
  const [pricingState, setPricingState] = useState<PricingBreakdown | null>(null);

  usePageMeta({
    title: pack ? `${pack.title} - Pack d'offres` : "Pack introuvable",
    description:
      pack?.shortDescription ?? "Consultez notre pack d'offres multi-pays avec plusieurs combinaisons d'hôtels.",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black-60">
        Chargement du pack...
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black-60">
        Pack introuvable.
      </div>
    );
  }

  const displayGallery = getOfferPackGalleryUrls(pack);
  const inclusionEntries = pack.inclusions?.map((inc) => ({
    label: inc.item,
    icon: inc.icon,
  })) ?? [];
  const exclusionLabels = pack.exclusions?.map((exc) => exc.item) ?? [];
  const programDays = pack.program?.map((day) => ({
    day: day.dayLabel,
    title: day.title,
    description: day.description ?? "",
    locations: day.locations?.map((location) => location.place),
    meals: day.meals?.map((meal) => meal.meal),
    images: day.images?.flatMap((image) => [image.image?.url ?? image.imageUrl ?? ""]).filter(Boolean),
    isLast: day.isLast,
  })) ?? [];
  const reservationCombinations = (pack.hotelCombinations ?? []).map((combo, comboIndex) => {
    const comboLabel = combo.label || `Combinaison ${comboIndex + 1}`;
    const entries = combo.entries ?? [];

    const comboSummary = entries
      .map((entry) => {
        const hotel = entry.hotel;
        const hotelName = typeof hotel === "string" ? "Hôtel" : hotel?.name || "Hôtel";
        const countryLabel = entry.country || "Pays";
        const stayDurationLabel = entry.stayDuration?.trim();
        return stayDurationLabel
          ? `${countryLabel}: ${hotelName} (${stayDurationLabel})`
          : `${countryLabel}: ${hotelName}`;
      })
      .join(" + ");

    const fallbackPriceAmount = entries.reduce((sum, entry) => {
      const hotel = entry.hotel;
      if (!hotel || typeof hotel === "string") {
        return sum;
      }

      return sum + parsePriceAmount(hotel.price);
    }, 0);

    const comboPriceAmount =
      typeof combo.adultPriceAmount === "number" && combo.adultPriceAmount > 0
        ? combo.adultPriceAmount
        : fallbackPriceAmount > 0
          ? fallbackPriceAmount
          : parsePriceAmount(pack.price);

    const comboPriceLabel =
      combo.adultPriceLabel?.trim() || comboPriceAmount.toLocaleString("fr-FR").replace(/,/g, " ");

    return {
      id: `${pack.id}-combo-${comboIndex + 1}`,
      name: `${comboLabel}${comboSummary ? ` - ${comboSummary}` : ""}`,
      pricePerPerson: comboPriceLabel,
      priceAmount: comboPriceAmount,
      childPriceBrackets: combo.childPriceBrackets ?? [],
    };
  });

  const hotelOptions =
    reservationCombinations.length > 0
      ? reservationCombinations
      : [
          {
            id: `${pack.id}-to-confirm`,
            name: "Combinaison à confirmer",
            pricePerPerson: pack.price,
            priceAmount: parsePriceAmount(pack.price),
          },
        ];

  return (
    <div className="min-h-screen min-w-full bg-white">
      <div className="bg-navy-100 text-white py-2 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Plane className="w-5 h-5" />
          <p className="text-sm font-medium tracking-tight">Travel to any wished destination</p>
        </div>
      </div>

      <nav className="bg-white border-b border-separator-90">
        <div className="max-w-[1200px] mx-auto relative flex items-center justify-center px-6 sm:px-10 py-5">
          <a href="/" className="absolute left-6 sm:left-10 flex-shrink-0">
            <img src="/assets/figma/logo.png" alt="AZ Voyage" className="h-10 object-contain" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-black-80 font-medium text-sm tracking-tight transition-colors duration-300 hover:text-gold-100 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold-100 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div className="space-y-4">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-navy-100 text-white px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              Pack d'offres
            </span>
            <h1 className="font-jakarta font-bold text-3xl sm:text-4xl text-black-100 tracking-tight">
              {pack.title}
            </h1>
            {pack.shortDescription && (
              <p className="text-black-60 text-base leading-relaxed">{pack.shortDescription}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-black-70">
              {pack.dates && (
                <span className="inline-flex items-center gap-1.5 bg-navy-10 rounded-full px-3 py-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {pack.dates}
                </span>
              )}
              {pack.startDate && (
                <span className="inline-flex items-center gap-1.5 bg-navy-10 rounded-full px-3 py-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {formatDateLabel(pack.startDate)}
                </span>
              )}
              {pack.departureTime && (
                <span className="inline-flex items-center gap-1.5 bg-navy-10 rounded-full px-3 py-1.5">
                  <Clock3 className="w-4 h-4" />
                  {pack.departureTime}
                </span>
              )}
              {pack.duration && (
                <span className="inline-flex items-center gap-1.5 bg-navy-10 rounded-full px-3 py-1.5">
                  <Clock3 className="w-4 h-4" />
                  {pack.duration}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-gold-100/20 rounded-full px-3 py-1.5 text-black-100 font-semibold">
                À partir de {pack.price} {pack.currency || "DZD"}
              </span>
              <a
                href="#reservation"
                className="inline-flex items-center rounded-full bg-navy-100 text-white px-4 py-1.5 font-semibold hover:bg-navy-90 transition-colors"
              >
                Réserver ce pack
              </a>
            </div>

          </div>
        </div>

        {displayGallery.length > 0 ? (
          <OfferGallery images={displayGallery} alt={pack.title} />
        ) : (
          <div className="rounded-2xl overflow-hidden border border-separator-90 bg-navy-10 min-h-[280px] flex items-center justify-center text-black-40">
            Image indisponible
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-jakarta font-semibold text-2xl text-black-100 tracking-tight">
            Combinaisons d'hôtels
          </h2>
          <p className="text-black-60">
            Chaque combinaison représente un choix complet d'hôtels pour les pays sélectionnés.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {(pack.hotelCombinations ?? []).map((combo, comboIndex) => (
              <article
                key={`${combo.label || "combo"}-${comboIndex}`}
                className="rounded-2xl border border-separator-90 bg-white p-5 space-y-4"
              >
                <h3 className="font-semibold text-black-100">
                  {combo.label || `Combinaison ${comboIndex + 1}`}
                </h3>
                {(combo.adultPriceLabel || combo.adultPriceAmount) && (
                  <p className="text-sm font-semibold text-gold-100">
                    Prix : {combo.adultPriceLabel || combo.adultPriceAmount?.toLocaleString("fr-FR")} {pack.currency || "DZD"}
                  </p>
                )}
                {(combo.childPriceBrackets?.length ?? 0) > 0 && (
                  <p className="text-xs text-black-60">
                    Tarifs enfants disponibles: {combo.childPriceBrackets?.length}
                  </p>
                )}

                <div className="space-y-3">
                  {(combo.entries ?? []).map((entry, entryIndex) => {
                    const hotel = entry.hotel;
                    const hotelName = typeof hotel === "string" ? "Hôtel" : hotel?.name || "Hôtel";
                    const hotelImages = getPackHotelImageUrls(hotel);
                    const hotelStars = typeof hotel === "string" ? undefined : hotel?.stars;

                    return (
                      <div
                        key={`${entry.country || "country"}-${entryIndex}`}
                        className="rounded-xl border border-separator-90 p-3 bg-navy-5"
                      >
                        {hotelImages.length > 0 ? (
                          <HotelImageCarousel
                            images={hotelImages}
                            alt={hotelName}
                            className="mb-3"
                          />
                        ) : null}
                        <div className="flex items-center gap-2 text-black-100 font-medium">
                          <Building2 className="w-4 h-4" />
                          <span>{hotelName}</span>
                        </div>
                        {entry.country ? (
                          <p className="text-sm text-black-60 mt-1">Pays: {entry.country}</p>
                        ) : null}
                        {entry.stayDuration ? (
                          <p className="text-sm text-black-60 mt-1">
                            Durée dans cet hôtel: {entry.stayDuration}
                          </p>
                        ) : null}
                        {hotelStars ? (
                          <p className="text-sm text-black-60 mt-1">Catégorie: {hotelStars} étoiles</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>

        {(inclusionEntries.length > 0 || exclusionLabels.length > 0 || programDays.length > 0) && (
          <div className="space-y-10">
            {(inclusionEntries.length > 0 || exclusionLabels.length > 0) && (
              <OfferInclusions entries={inclusionEntries} exclusions={exclusionLabels} />
            )}
            {programDays.length > 0 && <OfferProgram days={programDays} />}
          </div>
        )}

        <div id="reservation" className="mt-8 border-t border-separator-90 pt-8">
          <ReservationForm
            hotels={hotelOptions}
            currency={pack.currency || "DZD"}
            offerTitle={`Pack: ${pack.title}`}
            offerId={pack.id}
            selectionLabel="Combinaison sélectionnée"
            onPricingChange={setPricingState}
          />
          {pricingState && (
            <p className="text-xs text-black-50 mt-3">
              Total estimé: {pricingState.total.toLocaleString("fr-FR")} {pack.currency || "DZD"}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}


