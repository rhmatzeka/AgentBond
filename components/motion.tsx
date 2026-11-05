"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { animateAll, gsap } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

/** True when the inline boot script decided this visit gets entrance motion. */
export function motionEnabled() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion");
}

/** Runs the entrance motion for every page; reverts and replays on client-side navigation. */
export function Motion() {
  const pathname = usePathname();

  useGSAP(
    (_, contextSafe) => {
      (window as Window & { __motion?: boolean }).__motion = true;
      if (!motionEnabled() || !contextSafe) return;
      // Measure words and lines with the real web font, not the fallback.
      let stop: (() => void) | undefined;
      const run = contextSafe(() => {
        stop = animateAll(document, contextSafe);
      });
      document.fonts.ready.then(run);
      return () => stop?.();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}

/**
 * Inline before first paint: hide marked elements only for visitors who get motion, and show
 * everything again if the motion bundle has not booted within 2.5 seconds.
 */
export const motionBootScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.classList.add("motion");setTimeout(function(){if(!window.__motion)d.classList.remove("motion")},2500)}catch(e){}})()`;
