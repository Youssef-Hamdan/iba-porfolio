import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "navy" | "white";

type AboutSectionHeaderProps = {
  variant: Variant;
  waterNumber: string;
  badge: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  className?: string;
};

export function AboutSectionHeader({
  variant,
  waterNumber,
  badge,
  kicker,
  title,
  lead,
  className,
}: AboutSectionHeaderProps) {
  const isnavy = variant === "navy";

  return (
    <div className={cn("relative mb-10 md:mb-14 lg:mb-16", className)}>
      <div
        className={cn(
          "absolute -left-4 -top-10 -z-10 select-none text-[8rem] font-black leading-none sm:-top-12 sm:text-[10rem] md:text-[12rem]",
          isnavy ? "text-white/[0.06]" : "text-iba-sky/[0.05]",
        )}
        aria-hidden
      >
        {waterNumber}
      </div>
      <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm",
            isnavy
              ? "border-white/25 bg-white/10 text-white"
              : "border-iba-sky/15 bg-iba-sky/[0.04] text-iba-sky",
          )}
        >
          {badge}
        </span>
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-2 h-[2px] w-8 shrink-0",
              isnavy ? "bg-iba-orange" : "bg-iba-orange",
            )}
            aria-hidden
          />
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-widest",
              isnavy ? "text-white/70" : "text-iba-sky/55",
            )}
          >
            {kicker}
          </p>
        </div>
        <h2
          className={cn(
            "text-balance text-3xl font-extrabold uppercase leading-[1.08] tracking-tight md:text-4xl lg:text-5xl",
            isnavy ? "text-white" : "text-iba-sky",
          )}
        >
          {title}
        </h2>
        {lead ? (
          <p
            className={cn(
              "max-w-2xl text-base font-medium leading-relaxed md:text-lg",
              isnavy ? "text-white/80" : "text-iba-muted",
            )}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </div>
  );
}
