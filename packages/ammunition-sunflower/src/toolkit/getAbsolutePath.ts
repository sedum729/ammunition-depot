export const getAbsolutePath = (url: string, base: string, hash?: boolean): string => {
  try {
    if (!url) return url;

    if (hash && url.startsWith("#")) return url;

    return new URL(url, base).href;
  } catch {
    return url;
  }
}