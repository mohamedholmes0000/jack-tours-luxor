export const DEFAULT_SAFE_IMAGE = "/photos/karnak.jpg";

export const trustedRemoteImageHosts = ["images.unsplash.com", "i.ibb.co"] as const;

const trustedRemoteImageHostSet = new Set<string>(trustedRemoteImageHosts);
const safeLocalImagePrefixes = ["/photos/", "/images/", "/uploads/"];

export function isSafeLocalImagePath(value: string) {
  return safeLocalImagePrefixes.some((prefix) => value.startsWith(prefix));
}

export function isTrustedRemoteImageUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && trustedRemoteImageHostSet.has(url.hostname);
  } catch {
    return false;
  }
}

export function isAllowedAdminImageSrc(value: string) {
  const source = value.trim();
  return isSafeLocalImagePath(source) || isTrustedRemoteImageUrl(source);
}

export function safeImageSrc(value: string | null | undefined, fallback = DEFAULT_SAFE_IMAGE) {
  const source = value?.trim();

  if (!source) {
    return fallback;
  }

  return isAllowedAdminImageSrc(source) ? source : fallback;
}
