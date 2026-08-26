const legacyBrandPattern = /\bjack\s+egypt\s+tour\b/gi;
const legacyLogoPattern = /\bjack\s*\/\s*egypt\s+tour\b/gi;

export function replaceLegacyBrandText(value: string | null | undefined) {
  return (value || "")
    .replace(legacyLogoPattern, "JACK / LUXOR TOUR")
    .replace(legacyBrandPattern, (match) =>
      match === match.toUpperCase() ? "JACK LUXOR TOUR" : "Jack Luxor Tour",
    );
}

export function replaceLegacyLogoSubtitle(value: string | null | undefined) {
  return value?.trim().toUpperCase() === "EGYPT TOUR"
    ? "LUXOR TOUR"
    : replaceLegacyBrandText(value);
}
