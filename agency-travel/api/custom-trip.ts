import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "Service indisponible (RESEND_API_KEY manquante).",
      });
    }

    const TRIP_RECIPIENT_EMAIL =
      process.env.TRIP_RECIPIENT_EMAIL || "devisaz.off@gmail.com";
    const RESEND_FROM_EMAIL =
      process.env.RESEND_FROM_EMAIL || "AZ Voyage <onboarding@resend.dev>";

    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "fullName et email sont obligatoires.",
      });
    }

    const destinations = asArray(body.destinations);
    const startDate = body.startDate ?? null;
    const endDate = body.endDate ?? null;
    const budget = body.budget ?? null;
    const adults = body.adults ?? null;
    const children = body.children ?? null;
    const childAges = Array.isArray(body.childAges) ? body.childAges : [];

    const html = `
      <h2>Demande de devis sur mesure</h2>
      <p><b>Nom:</b> ${fullName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Téléphone:</b> ${phone}</p>
      <p><b>Destinations:</b> ${destinations.join(", ")}</p>
      <p><b>Dates:</b> ${startDate ?? ""} → ${endDate ?? ""}</p>
      <p><b>Budget:</b> ${budget ?? ""}</p>
      <p><b>Adultes:</b> ${adults ?? ""}</p>
      <p><b>Enfants:</b> ${children ?? ""}</p>
      <p><b>Âges enfants:</b> ${childAges.join(", ")}</p>
    `;

    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: TRIP_RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Voyage sur mesure - ${fullName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({
        success: false,
        message: "Erreur email provider (Resend).",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Demande envoyée avec succès.",
      id: data?.id ?? null,
    });
  } catch (err: any) {
    console.error("Function error:", err?.stack || err);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'envoi.",
    });
  }
}
