import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { mapResendSendError } from "@/lib/resend-errors";

/** Destinataire par défaut ; surcharge possible avec SEND_TO_EMAIL (ex. même adresse que le compte Resend). */
const DEFAULT_TO_EMAIL = "youssefhamdan.work@gmail.com";

export async function POST() {
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

  const to =
    process.env.SEND_TO_EMAIL?.trim() || DEFAULT_TO_EMAIL;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Resend <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: "Hello World",
      react: EmailTemplate({ firstName: "John" }),
    });

    if (error) {
      console.error("[api/send]", error);
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
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true as const,
      id: data?.id,
      to,
      from,
    });
  } catch (error) {
    console.error("[api/send]", error);
    return NextResponse.json({ error: "Envoi impossible." }, { status: 500 });
  }
}
