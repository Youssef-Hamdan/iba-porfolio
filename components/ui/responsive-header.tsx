"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

/** Wrapper so SiteHeader can nest markup; body is unwrapped inside the drawer panel */
export function DrawerContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

function unwrapDrawerContent(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === DrawerContent) {
      return (child.props as { children: React.ReactNode }).children;
    }
    return child;
  });
}

export type HeaderDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  drawerBtn: () => React.ReactElement;
  children: React.ReactNode;
};

/**
 * Controlled drawer (vaul): trigger opens panel; `open` / `setOpen` mirror Drawer.Root.
 */
export function HeaderDrawer({ open, setOpen, drawerBtn, children }: HeaderDrawerProps) {
  const trigger = drawerBtn();

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="right" modal>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px]" />
        <Drawer.Content
          className={cn(
            "fixed bottom-2 right-2 top-2 z-[70] flex w-[min(100vw-1rem,48rem)] flex-col rounded-xl border border-iba-navy/10 bg-white shadow-xl outline-none",
            "lg:w-[min(100vw-2rem,56rem)] xl:w-[min(100vw-2rem,72rem)]"
          )}
        >
          <Drawer.Title className="sr-only">Menu principal</Drawer.Title>
          <Drawer.Description className="sr-only">
            Liens vers les sections À Propos, Projets et Produits du site International Business Alliance.
          </Drawer.Description>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
            {unwrapDrawerContent(children)}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
