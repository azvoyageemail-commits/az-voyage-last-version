// import type { VercelRequest, VercelResponse } from "@vercel/node";

// interface ReservationResponse {
//   success: boolean;
//   message: string;
//   reservationId?: string;
// }

// export default async function handler(req: VercelRequest, res: VercelResponse<ReservationResponse>) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", "POST");
//     return res.status(405).json({ success: false, message: "Method Not Allowed" });
//   }

//   const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

//   const fullName = String(body.fullName ?? "").trim();
//   const phone = String(body.phone ?? "").trim();
//   const offerTitle = String(body.offerTitle ?? "").trim();
//   const offerId = String(body.offerId ?? "").trim();
//   const selectedHotel = String(body.selectedHotel ?? "").trim();
//   const adults = Number(body.adults ?? 0);
//   const children = Number(body.children ?? 0);
//   const totalEstimated = String(body.totalEstimated ?? "").trim();
//   const currency = String(body.currency ?? "DZD").trim() || "DZD";

//   if (!fullName || !phone || !selectedHotel || adults < 1) {
//     return res.status(400).json({
//       success: false,
//       message: "Champs obligatoires manquants.",
//     });
//   }

//   const cmsUrl = String(process.env.CMS_URL || process.env.VITE_CMS_URL || "").replace(/\/$/, "");

//   if (!cmsUrl) {
//     return res.status(503).json({
//       success: false,
//       message: "Service indisponible (CMS_URL manquante).",
//     });
//   }

//   try {
//     const cmsResponse = await fetch(`${cmsUrl}/api/reservations`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         fullName,
//         phone,
//         offerTitle,
//         offerId,
//         selectedHotel,
//         adults,
//         children: Math.max(0, children),
//         totalEstimated,
//         currency,
//         status: "new",
//       }),
//     });

//     const cmsPayload = await cmsResponse.json().catch(async () => ({
//       raw: await cmsResponse.text().catch(() => ""),
//     }));

//     if (!cmsResponse.ok) {
//       console.error("CMS reservation create error:", cmsPayload);

//       return res.status(502).json({
//         success: false,
//         message: "Erreur lors de l'enregistrement.",
//       });
//     }

//     const reservationId =
//       typeof cmsPayload === "object" &&
//       cmsPayload &&
//       "doc" in cmsPayload &&
//       cmsPayload.doc &&
//       typeof cmsPayload.doc === "object" &&
//       "id" in cmsPayload.doc
//         ? String(cmsPayload.doc.id)
//         : undefined;

//     if (!reservationId) {
//       console.error("CMS reservation create returned no document ID:", cmsPayload);

//       return res.status(502).json({
//         success: false,
//         message: "Erreur lors de l'enregistrement.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Demande de réservation enregistrée avec succès.",
//       reservationId,
//     });
//   } catch (error) {
//     console.error("Reservation API function error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Erreur serveur.",
//     });
//   }
// }



interface ReservationResponse {
  success: boolean;
  message: string;
  reservationId?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const offerTitle = String(body.offerTitle ?? "").trim();
  const offerId = String(body.offerId ?? "").trim();
  const selectedHotel = String(body.selectedHotel ?? "").trim();
  const adults = Number(body.adults ?? 0);
  const children = Number(body.children ?? 0);
  const totalEstimated = String(body.totalEstimated ?? "").trim();
  const currency = String(body.currency ?? "DZD").trim() || "DZD";

  if (!fullName || !phone || !selectedHotel || adults < 1) {
    return res.status(400).json({
      success: false,
      message: "Champs obligatoires manquants.",
    });
  }

  const env = (globalThis as any)?.process?.env ?? {};
  const cmsUrl = String(env.CMS_URL || env.VITE_CMS_URL || "").replace(/\/$/, "");

  if (!cmsUrl) {
    return res.status(503).json({
      success: false,
      message: "Service indisponible (CMS_URL manquante).",
    });
  }

  try {
    const cmsResponse = await fetch(`${cmsUrl}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        offerTitle,
        offerId,
        selectedHotel,
        adults,
        children: Math.max(0, children),
        totalEstimated,
        currency,
        status: "new",
      }),
    });

    const cmsPayload = await cmsResponse.json().catch(async () => ({
      raw: await cmsResponse.text().catch(() => ""),
    }));

    if (!cmsResponse.ok) {
      console.error("CMS reservation create error:", cmsPayload);

      return res.status(502).json({
        success: false,
        message: "Erreur lors de l'enregistrement.",
      });
    }

    const reservationId =
      typeof cmsPayload === "object" &&
      cmsPayload &&
      "doc" in cmsPayload &&
      cmsPayload.doc &&
      typeof cmsPayload.doc === "object" &&
      "id" in cmsPayload.doc
        ? String(cmsPayload.doc.id)
        : undefined;

    if (!reservationId) {
      console.error("CMS reservation create returned no document ID:", cmsPayload);

      return res.status(502).json({
        success: false,
        message: "Erreur lors de l'enregistrement.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Demande de réservation enregistrée avec succès.",
      reservationId,
    });
  } catch (error) {
    console.error("Reservation API function error:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur.",
    });
  }
}

