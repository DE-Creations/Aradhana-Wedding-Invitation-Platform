import { useEffect, type CSSProperties } from "react";
import type { TypographyOption } from "@/data/invitationConstants";

/** CSS variables that drive the `font-t-heading` / `font-t-body` utilities for a typography pairing. */
export const typographyStyle = (typography: TypographyOption): CSSProperties =>
  ({
    "--t-heading": typography.headingFamily,
    "--t-body": typography.bodyFamily,
  }) as CSSProperties;

const googleFontsHref = (options: TypographyOption[]) => {
  const families = Array.from(new Set(options.flatMap((o) => o.googleFonts)));
  // Google Fonts expects ":", ",", ";" and "@" unescaped inside a family spec; only spaces need encoding.
  const query = families.map((f) => `family=${f.replace(/ /g, "+")}`).join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
};

/** Loads the Google Fonts needed by the given typography options (once per distinct set). */
export const useTypographyFonts = (options: TypographyOption[]) => {
  const href = googleFontsHref(options);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.querySelector(`link[data-typography-fonts][href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-typography-fonts", "");
    document.head.appendChild(link);
  }, [href]);
};
