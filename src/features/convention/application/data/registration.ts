export const PACKAGE_FEATURE_KEYS = [
  "convention.registration.package.feature1",
  "convention.registration.package.feature2",
  "convention.registration.package.feature5",
] as const;

export const PRICE_TIERS = [
  {
    nameKey: "convention.registration.quad.name",
    priceKey: "convention.registration.quad.price",
  },
  {
    nameKey: "convention.registration.trio.name",
    priceKey: "convention.registration.trio.price",
  },
  {
    nameKey: "convention.registration.duo.name",
    priceKey: "convention.registration.duo.price",
  },
  {
    nameKey: "convention.registration.solo.name",
    priceKey: "convention.registration.solo.price",
  },
] as const;
