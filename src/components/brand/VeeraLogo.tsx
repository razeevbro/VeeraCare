"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import veeraLogoPng from "@/assets/veera-logo-transparent.png";

type VeeraLogoProps = {
  className?: string;
  /** Navbar / compact header */
  variant?: "nav" | "lockup";
  /** Dark logo on light backgrounds, or light logo on dark (footer) */
  tone?: "dark" | "light";
};

export function VeeraLogo({
  className,
  variant = "nav",
}: VeeraLogoProps) {
  const showLockup = variant === "lockup";

  return (
    <span
      className={cn(
        "relative block",
        showLockup ? "h-12 w-[260px] md:h-14 md:w-[320px]" : "h-9 w-[160px] md:h-10 md:w-[200px]",
        className
      )}
      aria-label="Veera Care Facilities Management LLC"
    >
      <Image
        src={veeraLogoPng}
        alt="Veera Care Facilities Management LLC"
        fill
        priority={showLockup}
        className="object-contain"
        sizes={showLockup ? "240px" : "180px"}
      />
    </span>
  );
}
