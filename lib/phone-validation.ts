export const PHONE_MAX_LENGTH = 80;

/** Characters allowed in phone input (digits and common separators). */
const PHONE_ALLOWED_CHARS_RE = /^[\d\s+\-().]+$/;

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhoneNumber(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || trimmed.length > PHONE_MAX_LENGTH) return false;
  if (!PHONE_ALLOWED_CHARS_RE.test(trimmed)) return false;

  const digits = getPhoneDigits(trimmed);
  if (digits.length < 9 || digits.length > 15) return false;

  // DRC international: +243 / 243 + 9 digits
  if (digits.startsWith("243")) {
    return digits.length === 12;
  }

  // DRC local: 0 + 9 digits (ex. 089 677 6842)
  if (digits.startsWith("0")) {
    return digits.length === 10;
  }

  // Other international numbers
  return digits.length >= 9 && digits.length <= 15;
}

/**
 * Returns a French error message, or null when the value is valid.
 */
export function validatePhoneValue(
  value: unknown,
  options?: { required?: boolean },
): string | null {
  const required = options?.required ?? true;

  if (typeof value !== "string") {
    return "Le format du téléphone est invalide.";
  }

  const phone = value.trim();

  if (!phone) {
    return required ? "Le numéro de téléphone est requis." : null;
  }

  if (phone.length > PHONE_MAX_LENGTH) {
    return "Le téléphone ne doit pas dépasser 80 caractères.";
  }

  if (!PHONE_ALLOWED_CHARS_RE.test(phone)) {
    return "Le numéro ne peut contenir que des chiffres, espaces, +, -, ( ) et .";
  }

  const digits = getPhoneDigits(phone);
  if (digits.length < 9) {
    return "Le numéro est trop court.";
  }

  if (!isValidPhoneNumber(phone)) {
    return "Saisissez un numéro valide (ex. +243 900 000 000 ou 089 000 0000).";
  }

  return null;
}
