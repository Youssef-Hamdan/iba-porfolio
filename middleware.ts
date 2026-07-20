import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Edge middleware (not proxy.ts): OpenNext Cloudflare does not yet support
 * Next.js 16 Node.js proxy/middleware. middleware.ts still runs on Edge.
 */
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
