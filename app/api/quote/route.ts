import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validatePhoneValue } from "@/lib/phone-validation";
import { mapResendSendError } from "@/lib/resend-errors";

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

/** Clés renvoyées avec les messages de validation (voir POST /api/quote → `errors`). */
export type QuoteFieldKey =
  | "name"
  | "email"
  | "company"
  | "phone"
  | "message"
  | "request"
  | "items";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateQuoteInput(o: Record<string, unknown>): {
  errors: Partial<Record<QuoteFieldKey, string>>;
  parsed?: {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
    request: string;
    items: QuoteLine[];
  };
} {
  const errors: Partial<Record<QuoteFieldKey, string>> = {};

  const name = typeof o.name === "string" ? o.name.trim() : "";
  if (typeof o.name !== "string") {
    errors.name = "Le format du nom est invalide.";
  } else if (!name) {
    errors.name = "Le nom complet est requis.";
  } else if (name.length > 200) {
    errors.name = "Le nom ne doit pas dépasser 200 caractères.";
  }

  const email = typeof o.email === "string" ? o.email.trim() : "";
  if (typeof o.email !== "string") {
    errors.email = "Le format de l’e-mail est invalide.";
  } else if (!email) {
    errors.email = "L’adresse e-mail est requise.";
  } else if (!EMAIL_RE.test(email) || email.length > 320) {
    errors.email = "Saisissez une adresse e-mail valide.";
  }

  const company = typeof o.company === "string" ? o.company.trim() : "";
  if (typeof o.company !== "string") {
    errors.company = "Le format du champ entreprise est invalide.";
  } else if (company.length > 200) {
    errors.company = "Entreprise / projet : maximum 200 caractères.";
  }

  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const phoneError = validatePhoneValue(o.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  let message = "";
  if (typeof o.message === "string") {
    message = o.message.trim().slice(0, 8000);
  } else if (o.message !== undefined && o.message !== null) {
    errors.message = "Le format du message est invalide.";
  }

  let request = "";
  if (typeof o.request !== "string") {
    errors.request = "Le format de la description de la demande est invalide.";
  } else {
    const r = o.request.trim();
    if (!r) {
      errors.request = "Décrivez les matériaux ou produits souhaités.";
    } else if (r.length > 8000) {
      errors.request = "La description ne doit pas dépasser 8000 caractères.";
    } else {
      request = r;
    }
  }

  const itemsRaw = Array.isArray(o.items) ? o.items : o.items === undefined ? [] : null;
  if (itemsRaw === null) {
    errors.items = "La liste des produits doit être un tableau.";
  } else if (itemsRaw.length > 50) {
    errors.items = "Le manifeste ne peut pas dépasser 50 produits.";
  }

  const items: QuoteLine[] = [];
  if (itemsRaw && itemsRaw.length > 0 && itemsRaw.length <= 50) {
    for (const raw of itemsRaw) {
      if (!raw || typeof raw !== "object") {
        errors.items =
          "Une ou plusieurs lignes produit sont invalides (structure attendue : id, nom, catégorie, quantité).";
        break;
      }
      const it = raw as Record<string, unknown>;
      const id = typeof it.id === "string" ? it.id.trim().slice(0, 80) : "";
      const pname = typeof it.name === "string" ? it.name.trim().slice(0, 8000) : "";
      const categoryLabel =
        typeof it.categoryLabel === "string" ? it.categoryLabel.trim().slice(0, 120) : "";
      const qty =
        typeof it.quantity === "number" && Number.isFinite(it.quantity)
          ? Math.floor(it.quantity)
          : NaN;
      if (!id || !pname || !Number.isFinite(qty) || qty < 1 || qty > 999_999) {
        errors.items =
          "Chaque ligne doit avoir un identifiant, un nom et une quantité entre 1 et 999 999.";
        break;
      }
      items.push({
        id,
        name: pname,
        categoryLabel: categoryLabel || "—",
        quantity: qty,
      });
    }
    if (!errors.items && items.length !== itemsRaw.length) {
      errors.items = "Impossible de valider toutes les lignes du manifeste.";
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  if (hasErrors) {
    return { errors };
  }

  return {
    errors: {},
    parsed: {
      name,
      email,
      company,
      phone,
      message,
      request,
      items,
    },
  };
}

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
  request: string;
  items: QuoteLine[];
}): string {
  const rows = payload.items
    .map(
      (item, i) =>
        `<tr><td style="padding:8px;border:1px solid #ddd">${i + 1}</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(item.name)}</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(item.categoryLabel)}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${item.quantity}</td></tr>`,
    )
    .join("");

  const linesTable =
    payload.items.length > 0
      ? `<h2 style="font-size:1rem;margin-top:1.5rem">Lignes détaillées (si fournies)</h2>
<table style="border-collapse:collapse;width:100%;max-width:640px"><thead><tr style="background:#005c98;color:#fff"><th style="padding:8px;border:1px solid #ccc">#</th><th style="padding:8px;border:1px solid #ccc">Produit</th><th style="padding:8px;border:1px solid #ccc">Catégorie</th><th style="padding:8px;border:1px solid #ccc">Qté</th></tr></thead><tbody>${rows}</tbody></table>`
      : "";

  const messageBlock = payload.message.trim()
    ? `<p style="margin-top:1.5rem"><strong>Informations complémentaires</strong> :</p>
<pre style="white-space:pre-wrap;background:#f4f4f6;padding:12px;border-radius:8px;font-size:14px">${escapeHtml(payload.message)}</pre>`
    : "";

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;color:#282561;line-height:1.5">
<h1 style="font-size:1.25rem">Nouvelle demande de devis — IBA</h1>
<p><strong>Nom</strong> : ${escapeHtml(payload.name)}</p>
<p><strong>Société</strong> : ${escapeHtml(payload.company || "—")}</p>
<p><strong>Email</strong> : <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
<p><strong>Téléphone</strong> : ${escapeHtml(payload.phone || "—")}</p>
<h2 style="font-size:1rem;margin-top:1.5rem">Demande (matériaux / produits)</h2>
<pre style="white-space:pre-wrap;background:#f4f4f6;padding:12px;border-radius:8px;font-size:14px">${escapeHtml(payload.request || "—")}</pre>
${messageBlock}
${linesTable}
</body></html>`;
}

export async function POST(req: Request) {
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
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête JSON invalide." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const validation = validateQuoteInput(o);
  if (!validation.parsed) {
    return NextResponse.json(
      {
        error: "Veuillez corriger les champs indiqués.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const { name, email, company, phone, message, request, items } = validation.parsed;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "IBA Devis <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Devis IBA — ${name}`,
    html: buildQuoteEmailHtml({ name, company, email, phone, message, request, items }),
  });

  if (error) {
    console.error("[api/quote]", error);
    const msg =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "";
    const mapped = mapResendSendError(msg);
    if (mapped) {
      return NextResponse.json(
        { error: mapped.error, code: mapped.code },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: msg || "L’envoi du message a échoué." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true as const,
    id: data?.id,
  });
}
