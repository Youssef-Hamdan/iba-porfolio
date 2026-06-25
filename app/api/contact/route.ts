import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validatePhoneValue } from "@/lib/phone-validation";

/**
 * Même pile que `/api/quote` (Resend) :
 * - RESEND_API_KEY
 * - CONTACT_TO_EMAIL ou QUOTE_TO_EMAIL (boîte qui reçoit les messages)
 * - RESEND_FROM_EMAIL (optionnel)
 */

export type ContactFieldKey = "name" | "email" | "company" | "phone" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactInput(o: Record<string, unknown>): {
  errors: Partial<Record<ContactFieldKey, string>>;
  parsed?: {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
  };
} {
  const errors: Partial<Record<ContactFieldKey, string>> = {};

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
    message = o.message.trim();
  } else if (o.message !== undefined && o.message !== null) {
    errors.message = "Le format du message est invalide.";
  }

  if (!errors.message) {
    if (!message) {
      errors.message = "Veuillez décrire votre demande (message requis).";
    } else if (message.length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères.";
    } else {
      message = message.slice(0, 8000);
    }
  }

  if (Object.keys(errors).length > 0) {
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

function buildContactEmailHtml(payload: {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}): string {
  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;color:#282561;line-height:1.5">
<h1 style="font-size:1.25rem">Message de contact — IBA</h1>
<p><strong>Nom</strong> : ${escapeHtml(payload.name)}</p>
<p><strong>Société</strong> : ${escapeHtml(payload.company || "—")}</p>
<p><strong>Email</strong> : <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
<p><strong>Téléphone</strong> : ${escapeHtml(payload.phone || "—")}</p>
<p><strong>Message</strong> :</p>
<pre style="white-space:pre-wrap;background:#f4f4f6;padding:12px;border-radius:8px;font-size:14px">${escapeHtml(payload.message)}</pre>
</body></html>`;
}

function recipientEmail(): string | null {
  const contact = process.env.CONTACT_TO_EMAIL?.trim();
  if (contact) return contact;
  return process.env.QUOTE_TO_EMAIL?.trim() ?? null;
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

  const to = recipientEmail();
  if (!to) {
    return NextResponse.json(
      {
        error:
          "Configuration serveur incomplète : ajoutez CONTACT_TO_EMAIL ou QUOTE_TO_EMAIL (adresse qui reçoit les messages).",
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
  const validation = validateContactInput(o);
  if (!validation.parsed) {
    return NextResponse.json(
      {
        error: "Veuillez corriger les champs indiqués.",
        errors: validation.errors,
      },
      { status: 400 },
    );
  }

  const { name, email, company, phone, message } = validation.parsed;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "IBA Contact <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Contact IBA — ${name}`,
    html: buildContactEmailHtml({ name, company, email, phone, message }),
  });

  if (error) {
    console.error("[api/contact]", error);
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
            "Resend (expéditeur de test) : avec onboarding@resend.dev, la livraison n’est autorisée que vers l’adresse e-mail de votre compte Resend. Mettez cette adresse dans CONTACT_TO_EMAIL ou QUOTE_TO_EMAIL, ou vérifiez un domaine sur resend.com/domains.",
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

  return NextResponse.json({
    ok: true as const,
    id: data?.id,
  });
}
