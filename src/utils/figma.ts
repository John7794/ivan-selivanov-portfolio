/**
 * Utilities for Figma URLs and interactive embeds
 */

/**
 * Checks if a string is a valid Figma URL (file, design, proto)
 */
export function isFigmaUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = String(url).trim().toLowerCase();
  return clean.includes('figma.com/') || clean.includes('embed.figma.com/');
}

/**
 * Normalizes any Figma URL (share link, prototype link, design link) into an embeddable iframe src
 * Reference: https://www.figma.com/developers/embed
 */
export function getFigmaEmbedSrc(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const clean = String(rawUrl).trim();
  if (!clean) return null;

  // If already an embed url
  if (clean.includes('embed.figma.com') || clean.includes('figma.com/embed')) {
    return clean;
  }

  // If it's a standard figma.com URL (file, proto, design)
  if (clean.includes('figma.com/')) {
    return `https://embed.figma.com/proto?url=${encodeURIComponent(clean)}&scaling=contain&embed-host=share`;
  }

  return clean;
}

/**
 * Normalizes any Figma URL to open directly in Figma (new tab or app)
 */
export function getFigmaDirectUrl(project: { figmaUrl?: string; figmaEmbedUrl?: string; liveLink?: string }): string | null {
  if (project.figmaUrl && isFigmaUrl(project.figmaUrl)) {
    return project.figmaUrl;
  }

  // Extract from figmaEmbedUrl if it has &url=...
  if (project.figmaEmbedUrl) {
    try {
      const parsed = new URL(project.figmaEmbedUrl);
      const targetUrl = parsed.searchParams.get('url');
      if (targetUrl) return decodeURIComponent(targetUrl);
    } catch {}
    if (project.figmaEmbedUrl.includes('embed.figma.com/proto/')) {
      const cleanProto = project.figmaEmbedUrl.replace('embed.figma.com/proto/', 'www.figma.com/proto/');
      return cleanProto;
    }
    return project.figmaEmbedUrl;
  }

  if (project.liveLink && isFigmaUrl(project.liveLink)) {
    return project.liveLink;
  }

  return null;
}
