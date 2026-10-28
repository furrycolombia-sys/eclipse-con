import { useTranslation } from "@/i18n";
import bannerSrc from "@/assets/hero/banner.webp";
import bannerNarrowSrc from "@/assets/hero/banner-1280.webp";
import { FollowCta } from "@/components/FollowCta";
import { tid } from "@/lib/tid";

/** The event runs Thursday–Sunday, 23–26 September 2027 (ISO 8601 interval). */
const EVENT_DATES = "2027-09-23/2027-09-26";

/** Split a "Brand YEAR" wordmark into its brand and trailing-year parts. */
function splitWordmark(wordmark: string): readonly [string, string] {
  const lastSpace = wordmark.lastIndexOf(" ");
  if (lastSpace > 0) {
    const tail = wordmark.slice(lastSpace + 1);
    if (/^\d{4}$/.test(tail)) {
      return [wordmark.slice(0, lastSpace), tail];
    }
  }
  return [wordmark, ""];
}

/**
 * Full-screen hero: the Sunfest 2027 illustration fills the viewport, with the
 * wordmark, slogan, event dates and CTA centered over it — the rest of the page scrolls up
 * beneath it.
 */
export function Hero() {
  const { t } = useTranslation();
  const wordmark = t("teaser.wordmark");
  const [brand, year] = splitWordmark(wordmark);

  return (
    <section
      className="hero"
      data-content-section="teaser"
      data-testid={tid("hero")}
    >
      <img
        className="hero-banner"
        src={bannerSrc}
        srcSet={`${bannerNarrowSrc} 1280w, ${bannerSrc} 1920w`}
        sizes="100vw"
        alt={t("teaser.bannerAlt")}
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-scrim" aria-hidden="true" />

      <div className="content hero-content">
        <p className="eyebrow">{t("teaser.eyebrow")}</p>
        <h1 className="wordmark" aria-label={wordmark}>
          <span aria-hidden="true">{brand}</span>
          {year && (
            <span className="year" aria-hidden="true">
              {year}
            </span>
          )}
        </h1>
        <p className="slogan">{t("teaser.slogan")}</p>
        <p className="hero-dates">
          <time dateTime={EVENT_DATES}>{t("teaser.dates")}</time>
        </p>
        <FollowCta
          testId="hero-follow"
          contentId="hero_follow_telegram"
          ctaId="hero_follow"
        />
      </div>
    </section>
  );
}
