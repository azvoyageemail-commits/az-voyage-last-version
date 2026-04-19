// import type { CollectionConfig } from "payload";

// const inclusionIconOptions = [
//   { label: "Check", value: "check" },
//   { label: "Avion", value: "plane" },
//   { label: "Hôtel", value: "hotel" },
//   { label: "Transfert", value: "transfer" },
//   { label: "Assistance", value: "assistance" },
//   { label: "Repas", value: "meal" },
//   { label: "Lieu", value: "map" },
//   { label: "Calendrier", value: "calendar" },
// ];

// const toSlug = (value: string) =>
//   value
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");

// export const OfferPacks: CollectionConfig = {
//   slug: "offer-packs",
//   admin: {
//     useAsTitle: "title",
//     defaultColumns: ["title", "price", "status", "updatedAt"],
//   },
//   access: {
//     read: () => true,
//   },
//   fields: [
//     {
//       name: "title",
//       type: "text",
//       required: true,
//       label: "Titre du pack",
//     },
//     {
//       name: "slug",
//       type: "text",
//       unique: true,
//       admin: {
//         position: "sidebar",
//         description: "Auto-generated from title if left blank",
//       },
//     },
//     {
//       name: "shortDescription",
//       type: "textarea",
//       label: "Description courte",
//     },
//     {
//       name: "description",
//       type: "richText",
//       label: "Description complète",
//     },
//     {
//       name: "mainImage",
//       type: "upload",
//       relationTo: "media",
//       label: "Image principale",
//     },
//     {
//       name: "mainImageUrl",
//       type: "text",
//       label: "Image URL (fallback)",
//     },
//     {
//       name: "galleryImages",
//       type: "array",
//       label: "Galerie secondaire",
//       admin: {
//         description: "Ajoutez plusieurs images secondaires pour le pack.",
//       },
//       fields: [
//         {
//           name: "image",
//           type: "upload",
//           relationTo: "media",
//           label: "Image",
//         },
//         {
//           name: "imageUrl",
//           type: "text",
//           label: "Image URL (fallback)",
//         },
//       ],
//     },
//     {
//       name: "dates",
//       type: "text",
//       label: "Dates affichées",
//     },
//     {
//       name: "startDate",
//       type: "date",
//       label: "Date de départ",
//     },
//     {
//       name: "departureTime",
//       type: "text",
//       label: "Heure de départ",
//       admin: {
//         description: 'ex: "08:30"',
//       },
//     },
//     {
//       name: "durationDays",
//       type: "number",
//       label: "Durée (jours)",
//     },
//     {
//       name: "duration",
//       type: "text",
//       label: "Durée affichée",
//       admin: {
//         description: 'ex: "7 jours / 6 nuits"',
//       },
//     },
//     {
//       name: "price",
//       type: "text",
//       required: true,
//       label: "Prix affiché",
//     },
//     {
//       name: "priceAmount",
//       type: "number",
//       label: "Prix (numérique)",
//     },
//     {
//       name: "currency",
//       type: "text",
//       defaultValue: "DZD",
//       label: "Devise",
//     },
//     {
//       name: "badge",
//       type: "text",
//       label: "Badge",
//       admin: {
//         description: 'ex: "Pack combiné"',
//       },
//     },
//     {
//       name: "badgeVariant",
//       type: "select",
//       label: "Style du badge",
//       defaultValue: "info",
//       options: [
//         { label: "Info", value: "info" },
//         { label: "Warning", value: "warning" },
//         { label: "Danger", value: "danger" },
//       ],
//     },
//     {
//       name: "status",
//       type: "select",
//       label: "Statut",
//       defaultValue: "available",
//       options: [
//         { label: "Disponible", value: "available" },
//         { label: "Presque complet", value: "almost-full" },
//         { label: "Complet", value: "full" },
//       ],
//     },
//     {
//       name: "hotelCombinations",
//       type: "array",
//       required: true,
//       minRows: 1,
//       label: "Combinaisons d'hôtels",
//       admin: {
//         description:
//           "Créez autant de combinaisons que nécessaire. Exemple: combinaison 1 = hôtel Algérie + hôtel Tunisie.",
//       },
//       fields: [
//         {
//           name: "label",
//           type: "text",
//           required: true,
//           label: "Nom de la combinaison",
//           admin: {
//             description: 'ex: "Confort", "Premium", "Économique"',
//           },
//         },
//         {
//           name: "adultPriceLabel",
//           type: "text",
//           label: "Prix adulte affiché (combinaison)",
//           admin: {
//             description: 'ex: "85 000 DA". Ce prix est propre à la combinaison.',
//           },
//         },
//         {
//           name: "adultPriceAmount",
//           type: "number",
//           label: "Prix adulte numérique (combinaison)",
//           admin: {
//             description:
//               "Utilisé pour le calcul total de la réservation. Laissez vide pour fallback automatique.",
//           },
//         },
//         {
//           name: "childPriceBrackets",
//           type: "array",
//           label: "Tarifs enfants par tranche d'âge (combinaison)",
//           labels: { singular: "Tranche", plural: "Tranches" },
//           admin: {
//             description:
//               "Définissez les prix enfants de cette combinaison (indépendants des hôtels).",
//           },
//           fields: [
//             {
//               name: "label",
//               type: "text",
//               required: true,
//               label: "Libellé",
//               admin: { description: 'Ex: "2 – 4 ans"' },
//             },
//             {
//               name: "minAge",
//               type: "number",
//               label: "Âge min (mois)",
//             },
//             {
//               name: "maxAge",
//               type: "number",
//               label: "Âge max (mois)",
//             },
//             {
//               name: "priceAmount",
//               type: "number",
//               required: true,
//               label: "Prix (numérique)",
//             },
//             {
//               name: "priceLabel",
//               type: "text",
//               label: "Prix affiché",
//               admin: { description: 'Ex: "15 000 DA"' },
//             },
//           ],
//         },
//         {
//           name: "entries",
//           type: "array",
//           required: true,
//           minRows: 1,
//           label: "Pays + hôtel",
//           admin: {
//             description:
//               "Associez librement un pays et un hôtel pour chaque étape de la combinaison.",
//           },
//           fields: [
//             {
//               name: "country",
//               type: "text",
//               required: true,
//               label: "Pays",
//             },
//             {
//               name: "hotel",
//               type: "relationship",
//               relationTo: "hotels",
//               required: true,
//               label: "Hôtel",
//             },
//             {
//               name: "stayDuration",
//               type: "text",
//               required: true,
//               label: "Durée dans cet hôtel",
//               admin: {
//                 description: 'ex: "2 nuits"',
//               },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "inclusions",
//       type: "array",
//       label: "Inclusions",
//       admin: {
//         description:
//           "Chaque ligne peut définir le texte affiché dans 'Ce qui est inclus' ainsi que son icône.",
//       },
//       fields: [
//         {
//           name: "item",
//           type: "text",
//           required: true,
//           label: "Texte",
//         },
//         {
//           name: "icon",
//           type: "select",
//           label: "Icône",
//           defaultValue: "check",
//           options: inclusionIconOptions,
//         },
//       ],
//     },
//     {
//       name: "exclusions",
//       type: "array",
//       label: "Exclusions",
//       fields: [
//         {
//           name: "item",
//           type: "text",
//           required: true,
//         },
//       ],
//     },
//     {
//       name: "program",
//       type: "array",
//       label: "Programme",
//       labels: {
//         singular: "Jour du programme",
//         plural: "Jours du programme",
//       },
//       admin: {
//         description:
//           "Ajoutez ici le programme du pack : jour, titre, description, lieux, repas et photos.",
//         initCollapsed: true,
//       },
//       fields: [
//         {
//           name: "dayLabel",
//           type: "text",
//           required: true,
//           label: "Jour",
//           admin: { description: 'ex: "JOUR 1"' },
//         },
//         {
//           name: "title",
//           type: "text",
//           required: true,
//           label: "Titre du jour",
//         },
//         {
//           name: "description",
//           type: "textarea",
//           label: "Description du jour",
//         },
//         {
//           name: "locations",
//           type: "array",
//           label: "Lieux visités",
//           fields: [
//             {
//               name: "place",
//               type: "text",
//               required: true,
//             },
//           ],
//         },
//         {
//           name: "meals",
//           type: "array",
//           label: "Repas inclus",
//           fields: [
//             {
//               name: "meal",
//               type: "text",
//               required: true,
//               admin: { description: 'ex: "Petit-déjeuner", "Dîner"' },
//             },
//           ],
//         },
//         {
//           name: "images",
//           type: "array",
//           label: "Photos du jour",
//           fields: [
//             {
//               name: "image",
//               type: "upload",
//               relationTo: "media",
//             },
//             {
//               name: "imageUrl",
//               type: "text",
//               label: "Image URL (fallback)",
//             },
//           ],
//         },
//         {
//           name: "isLast",
//           type: "checkbox",
//           defaultValue: false,
//           label: "Dernier jour ?",
//         },
//       ],
//     },
//   ],
//   hooks: {
//     beforeChange: [
//       ({ data }) => {
//         if (data?.slug) {
//           data.slug = toSlug(data.slug);
//         } else if (data?.title) {
//           data.slug = toSlug(data.title);
//         }

//         return data;
//       },
//     ],
//   },
// };
















import type { CollectionConfig } from "payload";

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

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const OfferPacks: CollectionConfig = {
  slug: "offer-packs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "price", "status", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre du pack",
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
      name: "countries",
      type: "relationship",
      relationTo: "destinations",
      hasMany: true,
      label: "Destinations",
      admin: {
        description: "Sélectionnez une ou plusieurs destinations pour ce pack.",
      },
    },
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
      name: "galleryImages",
      type: "array",
      label: "Galerie secondaire",
      admin: {
        description: "Ajoutez plusieurs images secondaires pour le pack.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Image",
        },
        {
          name: "imageUrl",
          type: "text",
          label: "Image URL (fallback)",
        },
      ],
    },
    {
      name: "dates",
      type: "text",
      label: "Dates affichées",
    },
    {
      name: "startDate",
      type: "date",
      label: "Date de départ",
    },
    {
      name: "departureTime",
      type: "text",
      label: "Heure de départ",
      admin: {
        description: 'ex: "08:30"',
      },
    },
    {
      name: "durationDays",
      type: "number",
      label: "Durée (jours)",
    },
    {
      name: "duration",
      type: "text",
      label: "Durée affichée",
      admin: {
        description: 'ex: "7 jours / 6 nuits"',
      },
    },
    {
      name: "price",
      type: "text",
      required: true,
      label: "Prix affiché",
    },
    {
      name: "priceAmount",
      type: "number",
      label: "Prix (numérique)",
    },
    {
      name: "currency",
      type: "text",
      defaultValue: "DZD",
      label: "Devise",
    },
    {
      name: "badge",
      type: "text",
      label: "Badge",
      admin: {
        description: 'ex: "Pack combiné"',
      },
    },
    {
      name: "badgeVariant",
      type: "select",
      label: "Style du badge",
      defaultValue: "info",
      options: [
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Danger", value: "danger" },
      ],
    },
    {
      name: "status",
      type: "select",
      label: "Statut",
      defaultValue: "available",
      options: [
        { label: "Disponible", value: "available" },
        { label: "Presque complet", value: "almost-full" },
        { label: "Complet", value: "full" },
      ],
    },
    {
      name: "hotelCombinations",
      type: "array",
      required: true,
      minRows: 1,
      label: "Combinaisons d'hôtels",
      admin: {
        description:
          "Créez autant de combinaisons que nécessaire. Exemple: combinaison 1 = hôtel Algérie + hôtel Tunisie.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Nom de la combinaison",
          admin: {
            description: 'ex: "Confort", "Premium", "Économique"',
          },
        },
        {
          name: "adultPriceLabel",
          type: "text",
          label: "Prix adulte affiché (combinaison)",
          admin: {
            description: 'ex: "85 000 DA". Ce prix est propre à la combinaison.',
          },
        },
        {
          name: "adultPriceAmount",
          type: "number",
          label: "Prix adulte numérique (combinaison)",
          admin: {
            description:
              "Utilisé pour le calcul total de la réservation. Laissez vide pour fallback automatique.",
          },
        },
        {
          name: "childPriceBrackets",
          type: "array",
          label: "Tarifs enfants par tranche d'âge (combinaison)",
          labels: { singular: "Tranche", plural: "Tranches" },
          admin: {
            description:
              "Définissez les prix enfants de cette combinaison (indépendants des hôtels).",
          },
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
        {
          name: "entries",
          type: "array",
          required: true,
          minRows: 1,
          label: "Pays + hôtel",
          admin: {
            description:
              "Associez librement un pays et un hôtel pour chaque étape de la combinaison.",
          },
          fields: [
            {
              name: "country",
              type: "text",
              required: true,
              label: "Pays",
            },
            {
              name: "hotel",
              type: "relationship",
              relationTo: "hotels",
              required: true,
              label: "Hôtel",
            },
            {
              name: "stayDuration",
              type: "text",
              required: true,
              label: "Durée dans cet hôtel",
              admin: {
                description: 'ex: "2 nuits"',
              },
            },
          ],
        },
      ],
    },
    {
      name: "inclusions",
      type: "array",
      label: "Inclusions",
      admin: {
        description:
          "Chaque ligne peut définir le texte affiché dans 'Ce qui est inclus' ainsi que son icône.",
      },
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
    {
      name: "program",
      type: "array",
      label: "Programme",
      labels: {
        singular: "Jour du programme",
        plural: "Jours du programme",
      },
      admin: {
        description:
          "Ajoutez ici le programme du pack : jour, titre, description, lieux, repas et photos.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "dayLabel",
          type: "text",
          required: true,
          label: "Jour",
          admin: { description: 'ex: "JOUR 1"' },
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
          fields: [
            {
              name: "place",
              type: "text",
              required: true,
            },
          ],
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
              admin: { description: 'ex: "Petit-déjeuner", "Dîner"' },
            },
          ],
        },
        {
          name: "images",
          type: "array",
          label: "Photos du jour",
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

