"use client";

import { createContext, useContext } from "react";

export const SiteReadyContext = createContext(false);

export function useSiteReady() {
  return useContext(SiteReadyContext);
}
