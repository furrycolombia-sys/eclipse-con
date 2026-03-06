import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/shared/presentation/ui/button";
import { tid } from "@/shared/application/utils/tid";
import { SECTION_IDS } from "@/features/convention/domain/constants";
import { useIsMobileViewport } from "@/shared/application/hooks/useIsMobileViewport";
import { useExperiment } from "@/shared/application/hooks/useExperiment";

const heroBathSingle = "/hero-bath-preview.webp";

const EXPERIMENT_ID = "hero-bath-layout";
const VARIANTS = ["control", "treatment", "pattern"] as const;
type HeroVariant = (typeof VARIANTS)[number];

const heroTextShadow = {
  filter:
    "drop-shadow(0 2px 4px rgba(0,0,0,0.95)) drop-shadow(0 4px 16px rgba(0,0,0,0.75))",
} satisfies React.CSSProperties;

function HeroBathPicture({ className = "" }: { readonly className?: string }) {
  return (
    <img
      src={heroBathSingle}
      alt=""
      aria-hidden="true"
      className={`h-full w-auto select-none object-cover brightness-80 ${className}`}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      draggable={false}
    />
  );
}

const useHeroClipOverlap = (
  bathLayerRef: React.RefObject<HTMLDivElement | null>,
  textLayerRef: React.RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    let frame = 0;

    const applyClipFromOverlap = (
      element: HTMLDivElement | null,
      coverTop: number
    ) => {
      if (!element) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      const hiddenByCover = Math.max(0, bounds.bottom - coverTop);
      const cutPx = Math.min(bounds.height, hiddenByCover);
      const clipValue = `inset(0 0 ${cutPx.toFixed(2)}px 0)`;
      element.style.clipPath = clipValue;
      element.style.setProperty("-webkit-clip-path", clipValue);
    };

    const updateClipping = () => {
      frame = 0;
      const nextSection = document.getElementById(SECTION_IDS.ABOUT);
      if (!nextSection) {
        return;
      }

      const nextTop = nextSection.getBoundingClientRect().top;
      applyClipFromOverlap(bathLayerRef.current, nextTop);
      applyClipFromOverlap(textLayerRef.current, nextTop);
    };

    const onScrollOrResize = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(updateClipping);
    };

    updateClipping();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("orientationchange", onScrollOrResize);
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("orientationchange", onScrollOrResize);
    };
  }, [bathLayerRef, textLayerRef]);
};

function HeroCrescent() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute"
      style={{
        height: "260%",
        aspectRatio: "1",
        left: "-14%",
        top: "50%",
        transform: "translateY(-48%)",
        zIndex: 0,
      }}
    >
      <defs>
        <mask id="hero-crescent-mask">
          <circle cx="250" cy="250" r="220" fill="white" />
          <circle cx="318" cy="240" r="192" fill="black" />
        </mask>
      </defs>
      <circle
        cx="250"
        cy="250"
        r="220"
        fill="#252d52"
        mask="url(#hero-crescent-mask)"
      />
    </svg>
  );
}

function HeroTextContent({
  showCrescent,
  layerRef,
}: {
  readonly showCrescent: boolean;
  readonly layerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
  return (
    <div ref={layerRef} className="relative z-30 px-4 text-center">
      <p
        className="mb-1 text-sm font-bold italic uppercase tracking-[0.35em] text-white/90 md:text-base"
        style={heroTextShadow}
      >
        {t("convention.hero.eyebrow")}
      </p>
      <div className="relative inline-block">
        {showCrescent && <HeroCrescent />}
        <h1
          className="hero-title relative z-[1] text-[4.5rem] font-bold leading-none text-white md:text-[7rem] lg:text-[9rem] xl:text-[10rem] 2xl:text-[12rem]"
          style={heroTextShadow}
        >
          {t("convention.hero.title")}
        </h1>
        {/* Sparkle decorations */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-0 text-white/80 md:-right-4 lg:-right-6"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 2rem)",
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
          }}
        >
          ✦
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 bottom-2 text-white/50 md:-right-8 lg:-right-10"
          style={{
            fontSize: "clamp(0.6rem, 1.2vw, 1rem)",
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
          }}
        >
          ✦
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 -top-2 text-white/30 md:right-6 lg:right-8"
          style={{
            fontSize: "clamp(0.4rem, 0.8vw, 0.7rem)",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))",
          }}
        >
          ✦
        </span>
      </div>
      <p
        className="mt-5 text-sm font-semibold uppercase tracking-[0.35em] text-white/90 md:text-base"
        style={heroTextShadow}
      >
        {t("convention.hero.date")}
      </p>
      <Button
        asChild
        size="lg"
        className="group relative mt-8 h-auto rounded-full bg-gradient-to-r from-[#f07c3a] to-[#d9531a] px-10 py-3.5 text-base font-bold text-white shadow-[0_8px_28px_-8px_rgba(240,100,40,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_-6px_rgba(240,100,40,0.9)]"
      >
        <Link
          to={`?section=${encodeURIComponent(SECTION_IDS.REGISTRATION)}`}
          data-funnel-step="view_pricing"
          data-cta-id="hero_primary_cta"
          data-cta-variant="hero_primary"
          data-content-section="hero"
          data-content-id="hero_primary_cta"
          data-content-interaction="open"
        >
          <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(circle,rgba(240,100,40,0.45),transparent_60%)] opacity-70 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative">{t("convention.hero.cta")}</span>
        </Link>
      </Button>
    </div>
  );
}

/** Renders the full-screen Hero section with title, tagline, CTA, animated starry-sky background,
 * and mirrored bath illustration. The pattern variant adds a crescent moon decoration above the
 * bath layer. Every visual layer clips away cleanly as the next section scrolls into view.
 */
export function HeroSection() {
  const isMobileViewport = useIsMobileViewport();
  const bathLayerRef = useRef<HTMLDivElement | null>(null);
  const textLayerRef = useRef<HTMLDivElement | null>(null);
  const variant = useExperiment(
    EXPERIMENT_ID,
    VARIANTS,
    "pattern"
  ) as HeroVariant;
  useHeroClipOverlap(bathLayerRef, textLayerRef);

  return (
    <section
      id="section-hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      {...tid("section-hero")}
    >
      {/* Bath illustration anchored to the bottom — clips away on scroll */}
      <div
        ref={bathLayerRef}
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden"
      >
        <div className="relative z-0 mx-auto flex h-[390px] items-center justify-center gap-0 sm:h-[460px] md:h-[560px] lg:h-[680px]">
          {!isMobileViewport && <HeroBathPicture className="scale-x-[-1]" />}
          <HeroBathPicture />
          {!isMobileViewport && <HeroBathPicture className="scale-x-[-1]" />}
        </div>
      </div>

      <HeroTextContent
        showCrescent={variant !== "control"}
        layerRef={textLayerRef}
      />
    </section>
  );
}
