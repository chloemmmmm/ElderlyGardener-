export function getRouterBasename(baseUrl: string) {
  return baseUrl === "/" ? "/" : baseUrl.replace(/\/+$/, "");
}

export function getPublicAssetUrl(baseUrl: string, assetName: string) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${assetName.replace(/^\/+/, "")}`;
}
