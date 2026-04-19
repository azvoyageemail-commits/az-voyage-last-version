import type { CollectionConfig } from "payload";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const createOfferGallerySlot = (name: string, label: string) => ({
  name,
  type: "group" as const,
  label,
  fields: [
    {
      name: "image",
      type: "upload" as const,
      relationTo: "media" as const,
      label: "Image",
    },
    {
      name: "imageUrl",
      type: "text" as const,
      label: "Image URL (fallback)",
    },
  ],
});

const inclusionIconOptions = [
  { label: "Check", value: "check" },
  { label: "Avion", value: "plane" },
  { label: "Hôtel", value: "hotel" },
  { label: "Transfert", value: "transfer" },
  { label: "Assistance", value: "assistance" },
  { label: "Repas", value: "meal" },
  { label: "Lieu", value: "map" },
  { label: "Calendrier", value: "calendar" },
];

export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "destination", "country", "price", "status"],
  },
  access: {
    read: () => true,
  },
  fields: [
    /* ── Core identity ── */
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from title if left blank",
      },
    },
    {
      name: "destination",
      type: "text",
      required: true,
      label: "Destination",
    },
    {
      name: "country",
      type: "text",
      required: true,
      label: "Pays",
    },
    {
      name: "flag",
      type: "text",
      label: "Emoji drapeau (Obsolète)",
      admin: { description: "Ancien champ emoji. Utilisez plutôt 'Image du drapeau' ci-dessous." },
    },
    {
      name: "flagMedia",
      type: "upload",
      relationTo: "media",
      label: "Image du drapeau",
    },
    {
      name: "flagUrl",
      type: "text",
      label: "URL du drapeau (fallback)",
    },
    {
      name: "region",
      type: "select",
      label: "Région",
      options: [
        { label: "Turquie", value: "Turquie" },
        { label: "Europe", value: "Europe" },
        { label: "Moyen-Orient", value: "Moyen-Orient" },
        { label: "Asie", value: "Asie" },
        { label: "Afrique", value: "Afrique" },
        { label: "Océanie", value: "Océanie" },
        { label: "Omra", value: "Omra" },
      ],
    },

    /* ── Description ── */
    {
      name: "shortDescription",
      type: "textarea",
      label: "Description courte",
    },
    {
      name: "description",
      type: "richText",
      label: "Description complète",
    },

    /* ── Images ── */
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      label: "Image principale",
    },
    {
      name: "mainImageUrl",
      type: "text",
      label: "Image URL (fallback)",
    },
    {
      name: "detailGallery",
      type: "group",
      label: "Galerie detail de l'offre (4 images)",
      admin: {
        description:
          "Les 4 images affichees sur la page detail de l'offre : 1 grande image + 3 images laterales.",
      },
      fields: [
        createOfferGallerySlot("main", "Image principale"),
        createOfferGallerySlot("side01", "Image laterale 1"),
        createOfferGallerySlot("side02", "Image laterale 2"),
        createOfferGallerySlot("side03", "Image laterale 3"),
      ],
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Galerie photos (fallback)",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Image URL (fallback)",
        },
      ],
    },

    /* ── Dates & duration ── */
    {
      name: "dates",
      type: "text",
      label: "Dates affichées",
      admin: { description: 'e.g. "18-25 janvier"' },
    },
    {
      name: "startDate",
      type: "date",
      label: "Date de début",
    },
    {
      name: "endDate",
      type: "date",
      label: "Date de fin",
    },
    {
      name: "durationDays",
      type: "number",
      label: "Durée (jours)",
    },
    {
      name: "durationNights",
      type: "number",
      label: "Durée (nuits)",
    },
    {
      name: "duration",
      type: "text",
      label: "Durée affichée",
      admin: { description: 'e.g. "7 Jours"' },
    },

    /* ── Pricing global ── */
    {
      name: "price",
      type: "text",
      required: true,
      label: "Prix affiché (général)",
      admin: { description: 'Prix affiché sur la carte de l\'offre. e.g. "84 000"' },
    },
    {
      name: "priceAmount",
      type: "number",
      label: "Prix (numérique général)",
      admin: { description: "Prix de base de l'offre sans hôtel spécifique." },
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "DZD",
      label: "Devise",
    },

    /* ── Hotels avec prix par hôtel ── */
    {
      name: "hotels",
      type: "array",
      label: "Hôtels disponibles",
      admin: {
        description: "Associez un hôtel à cette offre et définissez son prix directement ici.",
      },
      fields: [
        {
          name: "hotel",
          type: "relationship",
          relationTo: "hotels",
          required: true,
          label: "Hôtel",
        },
        {
          name: "priceLabel",
          type: "text",
          label: "Prix adulte affiché",
          admin: { description: 'e.g. "84 000 DA"' },
        },
        {
          name: "priceAmount",
          type: "number",
          label: "Prix adulte (numérique)",
          admin: { description: "Utilisé pour les calculs de réservation." },
        },
        {
          name: "childPriceBrackets",
          type: "array",
          label: "Tarifs enfants par tranche d'âge",
          labels: { singular: "Tranche", plural: "Tranches" },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              label: "Libellé",
              admin: { description: 'Ex: "2 – 4 ans"' },
            },
            {
              name: "minAge",
              type: "number",
              label: "Âge min (mois)",
            },
            {
              name: "maxAge",
              type: "number",
              label: "Âge max (mois)",
            },
            {
              name: "priceAmount",
              type: "number",
              required: true,
              label: "Prix (numérique)",
            },
            {
              name: "priceLabel",
              type: "text",
              label: "Prix affiché",
              admin: { description: 'Ex: "15 000 DA"' },
            },
          ],
        },
      ],
    },

    /* ── Tags & badges ── */
    {
      name: "tag",
      type: "text",
      label: "Tag",
      admin: { description: 'e.g. "Coup de coeur", "Nouveau"' },
    },
    {
      name: "badge",
      type: "text",
      label: "Badge",
    },
    {
      name: "badgeVariant",
      type: "select",
      label: "Badge variante",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Danger", value: "danger" },
      ],
    },

    /* ── Status ── */
    {
      name: "status",
      type: "select",
      defaultValue: "available",
      label: "Statut",
      options: [
        { label: "Disponible", value: "available" },
        { label: "Bientôt complet", value: "almost-full" },
        { label: "Complet", value: "sold-out" },
      ],
      admin: { position: "sidebar" },
    },

    /* ── Homepage visibility ── */
    {
      name: "showOnHomepage",
      type: "checkbox",
      defaultValue: true,
      label: "Afficher sur la page d'accueil",
      admin: { position: "sidebar" },
    },

    /* ── Detail page fields ── */
    {
      name: "departureLocation",
      type: "text",
      label: "Lieu de départ",
    },
    {
      name: "location",
      type: "text",
      label: "Lieu / Adresse",
    },
    {
      name: "time",
      type: "text",
      label: "Heure",
    },
    {
      name: "metaDates",
      type: "text",
      label: "Dates détaillées",
    },
    {
      name: "metaDuration",
      type: "text",
      label: "Durée détaillée",
    },
    {
      name: "priceSummary",
      type: "textarea",
      label: "Résumé du prix",
    },
    {
      name: "priceCard",
      type: "group",
      label: "Carte tarifaire (sidebar)",
      fields: [
        {
          name: "description",
          type: "textarea",
          label: "Description en haut de la carte",
        },
        {
          name: "travellersLabel",
          type: "text",
          label: "Titre voyageurs",
          defaultValue: "Voyageurs",
        },
        {
          name: "defaultAdults",
          type: "number",
          label: "Nombre d'adultes par défaut",
          defaultValue: 1,
          min: 1,
        },
        {
          name: "travellersText",
          type: "text",
          label: "Texte voyageurs",
        },
        {
          name: "detailsTitle",
          type: "text",
          label: "Titre détails prix",
          defaultValue: "Détails du prix",
        },
        {
          name: "totalLabel",
          type: "text",
          label: "Libellé total",
          defaultValue: "Total estimé",
        },
        {
          name: "reserveButtonLabel",
          type: "text",
          label: "Texte bouton",
          defaultValue: "Réserver cette offre",
        },
        {
          name: "confirmationText",
          type: "text",
          label: "Texte confirmation",
          defaultValue: "Disponibilité confirmée avant validation",
        },
      ],
    },
    {
      name: "numberOfDays",
      type: "number",
      label: "Nombre de jours",
    },

    /* ── Inclusions ── */
    {
      name: "inclusions",
      type: "array",
      label: "Inclusions",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
          label: "Texte",
        },
        {
          name: "icon",
          type: "select",
          label: "Icône",
          defaultValue: "check",
          options: inclusionIconOptions,
        },
      ],
    },
    {
      name: "exclusions",
      type: "array",
      label: "Exclusions",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },

    /* ── Program ── */
    {
      name: "program",
      type: "array",
      label: "Programme",
      labels: {
        singular: "Jour du programme",
        plural: "Jours du programme",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "dayLabel",
          type: "text",
          required: true,
          label: "Jour",
          admin: { description: 'e.g. "JOUR 1"' },
        },
        {
          name: "title",
          type: "text",
          required: true,
          label: "Titre du jour",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description du jour",
        },
        {
          name: "locations",
          type: "array",
          label: "Lieux visités",
          fields: [{ name: "place", type: "text", required: true }],
        },
        {
          name: "meals",
          type: "array",
          label: "Repas inclus",
          fields: [
            {
              name: "meal",
              type: "text",
              required: true,
              admin: { description: 'e.g. "Petit-déjeuner", "Dîner"' },
            },
          ],
        },
        {
          name: "images",
          type: "array",
          label: "Photos du jour",
          fields: [
            { name: "image", type: "upload", relationTo: "media" },
            { name: "imageUrl", type: "text", label: "Image URL (fallback)" },
          ],
        },
        {
          name: "isLast",
          type: "checkbox",
          defaultValue: false,
          label: "Dernier jour ?",
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.slug = toSlug(data.slug);
        } else if (data?.title) {
          data.slug = toSlug(data.title);
        }
        return data;
      },
    ],
  },
};