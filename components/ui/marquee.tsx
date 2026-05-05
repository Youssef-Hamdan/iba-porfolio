import * as React from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  /** One continuous row (two copies) so flex `gap` is consistent at the loop seam. */
  const items = React.Children.toArray(children);

  return (
    <div
      {...props}
      className={cn(
        "group flex w-full min-w-0 overflow-hidden [--duration:40s] [--gap:3rem]",
        className,
      )}
    >
      <div
        className={cn(
          "iba-marquee-track flex w-max shrink-0 items-center gap-[var(--gap)] will-change-transform",
          reverse && "iba-marquee-track-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {items}
        {items.map((child, i) => {
          if (React.isValidElement<{ "aria-hidden"?: boolean }>(child)) {
            return React.cloneElement(child, {
              key: `marquee-clone-${i}-${String(child.key ?? i)}`,
              "aria-hidden": true,
            });
          }
          return (
            <React.Fragment key={`marquee-clone-${i}`}>{child}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
