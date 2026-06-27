export type ResendErrorCode =
  | "RESEND_DOMAIN_NOT_VERIFIED"
  | "RESEND_TEST_RECIPIENT_LIMIT";

export function mapResendSendError(message: string): {
  error: string;
  code: ResendErrorCode;
} | null {
  if (
    /domain is not verified/i.test(message) ||
    /verify a domain at resend\.com\/domains/i.test(message)
  ) {
    return {
      code: "RESEND_DOMAIN_NOT_VERIFIED",
      error:
        "Le domaine rdcsteel.com n’est pas encore vérifié sur Resend. Ajoutez-le et validez les enregistrements DNS sur resend.com/domains, puis utilisez RESEND_FROM_EMAIL = « IBA <info@rdcsteel.com> ».",
    };
  }

  if (/only send testing emails to your own email/i.test(message)) {
    return {
      code: "RESEND_TEST_RECIPIENT_LIMIT",
      error:
        "Avec l’expéditeur de test onboarding@resend.dev, Resend n’envoie qu’à l’adresse du compte (info@rdcsteel.com). Vérifiez que QUOTE_TO_EMAIL et CONTACT_TO_EMAIL valent exactement info@rdcsteel.com, ou vérifiez le domaine rdcsteel.com pour envoyer depuis info@rdcsteel.com.",
    };
  }

  return null;
}
