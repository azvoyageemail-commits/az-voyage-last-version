import { useQuery } from "@tanstack/react-query";
import { fetchByField, fetchCollection, resolveGalleryUrls, resolveImageUrl } from "@/lib/payload";
import type { ChildPriceBracket } from "@/lib/reservation-pricing";

type DestinationRelation =
  | string
  | {
      id?: string;
      name?: string;
      country?: string;
    };

type HotelRelation =
  | string
  | {
      id?: string;
      name?: string;
      mainImage?: { url?: string };
      mainImageUrl?: string;
      images?: Array<{ image?: { url?: string } | string | null; imageUrl?: string }>;
      dates?: string;
      price?: string;
      stars?: number;
      country?: string;
    };

export interface OfferPackItem {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  mainImage?: { url?: string };
  mainImageUrl?: string;
  galleryImages?: Array<{ image?: { url?: string }; imageUrl?: string }>;
  dates?: string;
  startDate?: string;
  departureTime?: string;
  duration?: string;
  durationDays?: number;
  price: string;
  badge?: string;
  badgeVariant?: "info" | "warning" | "danger";
  status?: "available" | "almost-full" | "full";
  countries?: DestinationRelation[];
  hotelCombinations?: Array<{
    label?: string;
    adultPriceLabel?: string;
    adultPriceAmount?: number;
    childPriceBrackets?: ChildPriceBracket[];
    entries?: Array<{
      country?: string;
      stayDuration?: string;
      hotel?: HotelRelation;
    }>;
  }>;
}

export interface OfferPackDetail extends OfferPackItem {
  description?: any;
  currency?: string;
  inclusions?: Array<{ item: string; icon?: string }>;
  exclusions?: Array<{ item: string }>;
  program?: Array<{
    dayLabel: string;
    title: string;
    description?: string;
    locations?: Array<{ place: string }>;
    meals?: Array<{ meal: string }>;
    images?: Array<{ image?: { url?: string }; imageUrl?: string }>;
    isLast?: boolean;
  }>;
  hotelCombinations?: Array<{
    label?: string;
    adultPriceLabel?: string;
    adultPriceAmount?: number;
    childPriceBrackets?: ChildPriceBracket[];
    entries?: Array<{
      country?: string;
      stayDuration?: string;
      hotel?: HotelRelation;
    }>;
  }>;
}

export function useOfferPacks() {
  return useQuery<OfferPackItem[]>({
    queryKey: ["offer-packs"],
    queryFn: async () => {
      const res = await fetchCollection<OfferPackItem>("offer-packs", {
        limit: 100,
        depth: 1,
        sort: "-createdAt",
      });

      return res.docs;
    },
  });
}

export function useOfferPack(slugOrId: string) {
  return useQuery<OfferPackDetail | null>({
    queryKey: ["offer-pack", slugOrId],
    queryFn: async () => {
      const bySlug = await fetchByField<OfferPackDetail>("offer-packs", "slug", slugOrId);
      if (bySlug) return bySlug;

      const byId = await fetchByField<OfferPackDetail>("offer-packs", "id", slugOrId);
      return byId;
    },
    enabled: Boolean(slugOrId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: true,
  });
}

export function getOfferPackImageSrc(pack: OfferPackItem): string {
  return resolveImageUrl(pack.mainImage, pack.mainImageUrl);
}

export function getOfferPackSecondaryImages(pack: OfferPackItem): string[] {
  if (!Array.isArray(pack.galleryImages)) {
    return [];
  }

  return pack.galleryImages
    .map((item) => resolveImageUrl(item?.image, item?.imageUrl))
    .filter(Boolean);
}

export function getOfferPackGalleryUrls(pack: OfferPackItem): string[] {
  const mainImage = getOfferPackImageSrc(pack);
  const secondaryImages = getOfferPackSecondaryImages(pack);

  return mainImage ? [mainImage, ...secondaryImages] : secondaryImages;
}

export function getOfferPackCountries(pack: OfferPackItem): string[] {
  if (!Array.isArray(pack.countries)) {
    return [];
  }

  const values = pack.countries.flatMap((entry) => {
    if (!entry || typeof entry === "string") {
      return [];
    }

    return [entry.country || "", entry.name || ""].filter(Boolean);
  });

  return Array.from(new Set(values));
}

export function getPackHotelImage(hotel?: HotelRelation): string {
  return getPackHotelImageUrls(hotel)[0] || "";
}

export function getPackHotelImageUrls(hotel?: HotelRelation): string[] {
  if (!hotel || typeof hotel === "string") {
    return [];
  }

  const mainImage = resolveImageUrl(hotel.mainImage, hotel.mainImageUrl);
  const galleryImages = resolveGalleryUrls(hotel.images);

  return [mainImage, ...galleryImages].filter(Boolean);
}

export function getOfferPackHotelNames(pack: OfferPackItem): string[] {
  const combinations = pack.hotelCombinations ?? [];
  const names = combinations.flatMap((combo) =>
    (combo.entries ?? []).flatMap((entry) => {
      const hotel = entry.hotel;
      if (!hotel || typeof hotel === "string" || !hotel.name) {
        return [];
      }

      return [hotel.name];
    }),
  );

  return Array.from(new Set(names));
}
