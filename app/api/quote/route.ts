import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Env requis en production :
 * - RESEND_API_KEY : clé API https://resend.com
 * - QUOTE_TO_EMAIL : adresse qui reçoit les demandes de devis
 *
 * Optionnel :
 * - RESEND_FROM_EMAIL : expéditeur vérifié (ex. "IBA <devis@votredomaine.com>").
 *   Sans domaine vérifié, utilisez le domaine de test Resend : "… <onboarding@resend.dev>"
 */

export type QuoteLine = {
  id: string;
  name: string;
  categoryLabel: string;
  quantity: number;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildQuoteEmailHtml(payload: {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  items: QuoteLine[];
}): string {
  const rows = payload.items
    .map(
      (item, i) =>
        `<tr><td style="padding:8px;border:1px solid #ddd">${i + 1}</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(item.name)}</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(item.categoryLabel)}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${item.quantity}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;color:#282561;line-height:1.5">
<h1 style="font-size:1.25rem">Nouvelle demande de devis — IBA</h1>
<p><strong>Nom</strong> : ${escapeHtml(payload.name)}</p>
<p><strong>Société</strong> : ${escapeHtml(payload.company || "—")}</p>
<p><strong>Email</strong> : <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
<p><strong>Téléphone</strong> : ${escapeHtml(payload.phone || "—")}</p>
<p><strong>Message</strong> :</p>
<pre style="white-space:pre-wrap;background:#f4f4f6;padding:12px;border-radius:8px;font-size:14px">${escapeHtml(payload.message || "—")}</pre>
<h2 style="font-size:1rem;margin-top:1.5rem">Lignes demandées</h2>
<table style="border-collapse:collapse;width:100%;max-width:640px"><thead><tr style="background:#005c98;color:#fff"><th style="padding:8px;border:1px solid #ccc">#</th><th style="padding:8px;border:1px solid #ccc">Produit</th><th style="padding:8px;border:1px solid #ccc">Catégorie</th><th style="padding:8px;border:1px solid #ccc">Qté</th></tr></thead><tbody>${rows}</tbody></table>
</body></html>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Configuration serveur incomplète : ajoutez RESEND_API_KEY (voir https://resend.com).",
      },
      { status: 503 },
    );
  }

  const to = process.env.QUOTE_TO_EMAIL?.trim();
  if (!to) {
    return NextResponse.json(
      {
        error:
          "Configuration serveur incomplète : ajoutez QUOTE_TO_EMAIL (adresse qui reçoit les devis).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête JSON invalide." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const message = typeof o.message === "string" ? o.message.trim().slice(0, 8000) : "";
  const itemsRaw = Array.isArray(o.items) ? o.items : [];

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (company.length > 200 || phone.length > 80) {
    return NextResponse.json({ error: "Champ trop long." }, { status: 400 });
  }
  if (itemsRaw.length === 0 || itemsRaw.length > 50) {
    return NextResponse.json(
      { error: "Ajoutez entre 1 et 50 produits au manifeste." },
      { status: 400 },
    );
  }

  const items: QuoteLine[] = [];
  for (const raw of itemsRaw) {
    if (!raw || typeof raw !== "object") continue;
    const it = raw as Record<string, unknown>;
    const id = typeof it.id === "string" ? it.id.trim().slice(0, 80) : "";
    const pname = typeof it.name === "string" ? it.name.trim().slice(0, 300) : "";
    const categoryLabel =
      typeof it.categoryLabel === "string" ? it.categoryLabel.trim().slice(0, 120) : "";
    const qty =
      typeof it.quantity === "number" && Number.isFinite(it.quantity)
        ? Math.floor(it.quantity)
        : NaN;
    if (!id || !pname || !Number.isFinite(qty) || qty < 1 || qty > 999_999) {
      return NextResponse.json({ error: "Une ligne produit est invalide." }, { status: 400 });
    }
    items.push({
      id,
      name: pname,
      categoryLabel: categoryLabel || "—",
      quantity: qty,
    });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Lignes produits invalides." }, { status: 400 });
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "IBA Devis <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Devis IBA — ${name}`,
    html: buildQuoteEmailHtml({ name, company, email, phone, message, items }),
  });

  if (error) {
    console.error("[api/quote]", error);
    const msg =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "";
    const isResendTestRecipientLimit =
      /only send testing emails to your own email/i.test(msg) ||
      /verify a domain at resend\.com\/domains/i.test(msg);
    if (isResendTestRecipientLimit) {
      return NextResponse.json(
        {
          error:
            "Resend (expéditeur de test) : avec onboarding@resend.dev, la livraison n’est autorisée que vers l’adresse e-mail de votre compte Resend. Mettez cette adresse dans QUOTE_TO_EMAIL, ou vérifiez un domaine sur resend.com/domains et utilisez RESEND_FROM_EMAIL = « Nom <devis@votredomaine.com> » pour envoyer vers n’importe quelle boîte.",
          code: "RESEND_UNVERIFIED_SENDER" as const,
        },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: msg || "L’envoi du message a échoué." },
      { status: 502 },
    );
  }

  const usingTestFrom = /onboarding@resend\.dev/i.test(from);
  return NextResponse.json({
    ok: true as const,
    id: data?.id,
    ...(usingTestFrom && {
      deliveryHint:
        "Mode test Resend : tant que l’expéditeur est onboarding@resend.dev, seule l’adresse du compte Resend reçoit réellement le message (QUOTE_TO_EMAIL doit correspondre, ou vérifiez un domaine pour la production). Vérifiez les indésirables et le journal Emails sur resend.com.",
    }),
  });
}
