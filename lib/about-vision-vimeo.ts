/** Lecteur principal (À propos) — `preload=auto` pour démarrer le tampon plus tôt. */
export const ABOUT_VISION_VIMEO_EMBED_URL =
  "https://player.vimeo.com/video/1190706245?autoplay=1&muted=1&controls=0&playsinline=1&loop=1&preload=auto&title=0&byline=0&portrait=0&badge=0&dnt=1&sidedock=0&autopause=0";

/**
 * Même vidéo, sans autoplay : iframe invisible après le chargement du site pour amorcer
 * le cache réseau avant d’ouvrir À propos (démontée sur /about pour éviter deux lecteurs).
 */
export const ABOUT_VISION_VIMEO_WARMUP_EMBED_URL =
  "https://player.vimeo.com/video/1190706245?autoplay=0&muted=1&controls=0&playsinline=1&loop=1&preload=auto&title=0&byline=0&portrait=0&badge=0&dnt=1&sidedock=0&autopause=0";

export const VIMEO_PLAYER_SCRIPT_URL = "https://player.vimeo.com/api/player.js";
