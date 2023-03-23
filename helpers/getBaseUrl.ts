const getBaseUrl = (): URL | undefined => {
  let baseUrlString =
    process.env?.NEXT_PUBLIC_URL ??
    process.env?.NEXT_PUBLIC_VERCEL_URL ??
    process.env?.NEXT_PUBLIC_FALLBACK_SITE_URL

  if (!baseUrlString) {
    return undefined;
  }

  if (!baseUrlString.startsWith('http')) {
    baseUrlString = `https://${baseUrlString}`;
  }

  return new URL(baseUrlString);
};

export default getBaseUrl;
