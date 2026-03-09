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

/**
 * Subscribes to scroll (and optionally resize) events, dispatching an
 * `updater` callback via `requestAnimationFrame` to avoid layout thrashing.
 * Returns a cleanup function that removes all listeners and cancels pending frames.
 */
function subscribeToScrollUpdates(
  updater: () => void,
  options: { resize?: boolean; scrollend?: boolean } = {}
): () => void {
  let frame = 0;

  const schedule = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        updater();
      });
    }
  };

  updater();
  window.addEventListener("scroll", schedule, { passive: true });
  if (options.resize) {
    window.addEventListener("resize", schedule);
  }
  if (options.scrollend) {
    window.addEventListener("scrollend", updater);
  }

  return () => {
    if (frame) {
      cancelAnimationFrame(frame);
    }
    window.removeEventListener("scroll", schedule);
    if (options.resize) {
      window.removeEventListener("resize", schedule);
    }
    if (options.scrollend) {
      window.removeEventListener("scrollend", updater);
    }
  };
}

/**
 * Applies scroll-based fade directly to the hero text and button elements.
 * Bypasses React state to avoid re-render lag on fast scroll-back.
 * Fading begins only after the next section covers the hero.
 */
function useHeroScrollFade(
  textRef: React.RefObject<HTMLDivElement | null>,
  buttonRef: React.RefObject<HTMLButtonElement | null>
) {
  useEffect(() => {
    return subscribeToScrollUpdates(
      () => {
        const stickyWrapper =
          document.querySelector<HTMLElement>(".hero-sticky");
        const vh = window.innerHeight;
        const stickyOverflow = stickyWrapper
          ? stickyWrapper.offsetHeight - vh
          : 0;
        const fadeStart = Math.max(0, stickyOverflow) + vh * 0.95;
        const fadeDistance = vh * 0.25;
        const scrolled = window.scrollY - fadeStart;
        const progress = Math.min(1, Math.max(0, scrolled / fadeDistance));

        const textOpacity = Math.max(0.08, 1 - progress * 1.2);
        const buttonOpacity = Math.max(0, 1 - progress * 2);

        if (textRef.current) {
          textRef.current.style.opacity = String(textOpacity);
        }
        if (buttonRef.current) {
          buttonRef.current.style.opacity = String(buttonOpacity);
          buttonRef.current.style.pointerEvents =
            buttonOpacity <= 0 ? "none" : "";
          buttonRef.current.style.visibility =
            buttonOpacity <= 0 ? "hidden" : "";
        }
      },
      { scrollend: true }
    );
  }, [textRef, buttonRef]);
}

function HeroCrescent() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute"
      style={{
        height: "250%",
        aspectRatio: "1",
        left: "12%",
        top: "50%",
        transform: "translateY(-43%)",
        zIndex: 0,
      }}
    >
      <defs>
        <mask id="hero-crescent-mask">
          <circle cx="250" cy="250" r="220" fill="white" />
          <circle cx="285" cy="238" r="190" fill="black" />
        </mask>
      </defs>
      <circle
        cx="250"
        cy="250"
        r="220"
        fill="white"
        opacity="0.5"
        mask="url(#hero-crescent-mask)"
      />
    </svg>
  );
}

function HeroTextContent({ showCrescent }: { readonly showCrescent: boolean }) {
  const { t } = useTranslation();
  const textRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useHeroScrollFade(textRef, buttonRef);

  return (
    <div className="relative z-30 px-4 text-center">
      <div ref={textRef}>
        <p
          className="-mb-4 text-xl font-bold italic uppercase tracking-[0.35em] text-white/90 md:-mb-6 md:text-2xl lg:-mb-8 lg:text-3xl"
          style={heroTextShadow}
        >
          {t("convention.hero.eyebrow")}
        </p>
        <div className="relative inline-block">
          {showCrescent && <HeroCrescent />}
          <h1
            className="hero-title relative z-[1] text-[4.5rem] leading-none text-white md:text-[7rem] lg:text-[9rem] xl:text-[10rem] 2xl:text-[12rem]"
            style={heroTextShadow}
          >
            {t("convention.hero.title")}
          </h1>
          {/* Sparkle decorations — two stars at upper-right */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-1 z-[1] text-white/90 md:-right-5 lg:-right-7"
            style={{
              fontSize: "clamp(1.2rem, 2.8vw, 2.4rem)",
              filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))",
            }}
          >
            ✦
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 z-[1] text-white/60 md:-right-10 lg:-right-14"
            style={{
              fontSize: "clamp(0.6rem, 1.2vw, 1rem)",
              filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
            }}
          >
            ✦
          </span>
        </div>
        <p
          className="mt-24 text-sm font-semibold uppercase tracking-[0.35em] text-white/90 md:mt-32 md:text-base lg:mt-40"
          style={heroTextShadow}
        >
          {t("convention.hero.date")}
        </p>
      </div>
      <Button
        ref={buttonRef}
        asChild
        variant="glow"
        size="lg"
        className="mt-8 h-auto px-10 py-3.5 text-base"
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
          {t("convention.hero.cta")}
        </Link>
      </Button>
    </div>
  );
}

/**
 * Hides the bath illustration once the content box scrolls over it.
 * Compares the content wrapper's top edge against the bath's top edge —
 * as soon as the content covers the bath area, it becomes hidden.
 */
function useHideBathOnScroll(bathRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    return subscribeToScrollUpdates(
      () => {
        const bath = bathRef.current;
        if (!bath) {
          return;
        }
        const stickyWrapper =
          document.querySelector<HTMLElement>(".hero-sticky");
        const contentBox =
          stickyWrapper?.nextElementSibling as HTMLElement | null;
        if (!contentBox) {
          return;
        }
        const bathTop = bath.getBoundingClientRect().top;
        const contentTop = contentBox.getBoundingClientRect().top;
        bath.style.visibility = contentTop <= bathTop ? "hidden" : "";
      },
      { resize: true }
    );
  }, [bathRef]);
}

/** Renders the full-screen Hero section with title, tagline, CTA, animated starry-sky background,
 * and mirrored bath illustration. The next section naturally scrolls over the bath image, and
 * visibility is toggled off once the hero is fully behind the content.
 */
export function HeroSection() {
  const isMobileViewport = useIsMobileViewport();
  const bathRef = useRef<HTMLDivElement | null>(null);
  const variant = useExperiment(
    EXPERIMENT_ID,
    VARIANTS,
    "pattern"
  ) as HeroVariant;
  useHideBathOnScroll(bathRef);

  return (
    <section
      id="section-hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      {...tid("section-hero")}
    >
      {/* Bath illustration anchored to the bottom — hidden by next section scrolling over */}
      <div
        ref={bathRef}
        className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden"
      >
        <div className="relative z-0 mx-auto flex h-[390px] items-center justify-center gap-0 sm:h-[460px] md:h-[560px] lg:h-[680px]">
          {!isMobileViewport && <HeroBathPicture className="scale-x-[-1]" />}
          <HeroBathPicture />
          {!isMobileViewport && <HeroBathPicture className="scale-x-[-1]" />}
        </div>
      </div>

      <HeroTextContent showCrescent={variant !== "control"} />
    </section>
  );
}
