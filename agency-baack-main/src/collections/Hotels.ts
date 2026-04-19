import type { CollectionConfig } from "payload";

export const Hotels: CollectionConfig = {
  slug: "hotels",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "stars", "city", "country", "dates"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: { description: "Description courte de l'hôtel" },
    },
    {
      name: "stars",
      type: "number",
      min: 1,
      max: 5,
      label: "Étoiles (1–5)",
    },
    {
      name: "rating",
      type: "number",
      min: 0,
      max: 5,
      label: "Note (0–5)",
    },
    {
      name: "address",
      type: "text",
      label: "Adresse",
    },
    {
      name: "city",
      type: "text",
      label: "Ville",
    },
    {
      name: "country",
      type: "text",
      label: "Pays",
    },
    {
      name: "dates",
      type: "text",
      label: "Dates affichées",
      admin: { description: 'e.g. "18-25 janvier 2026"' },
    },
    {
      name: "offers",
      type: "relationship",
      relationTo: "offers",
      hasMany: true,
      label: "Offres liées",
      admin: {
        readOnly: true,
        description:
          "Géré automatiquement depuis la collection Offres. Ne pas modifier ici.",
      },
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      label: "Image principale",
    },
    {
      name: "mainImageUrl",
      type: "text",
      label: "Image principale URL (fallback)",
    },
    {
      name: "images",
      type: "array",
      label: "Photos",
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
    {
      name: "amenities",
      type: "array",
      label: "Équipements",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "transferIncluded",
      type: "checkbox",
      defaultValue: false,
      label: "Transfert inclus",
      admin: {
        description:
          "Oui = afficher l'icône bus et le texte \"Transfert inclus\" sur la carte hôtel.",
      },
    },
    {
      name: "breakfastIncluded",
      type: "checkbox",
      defaultValue: false,
      label: "Petit-déjeuner inclus",
    },
  ],
};