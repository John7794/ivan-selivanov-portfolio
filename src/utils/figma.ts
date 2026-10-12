/**
 * Utilities for Figma URLs and secure interactive embeds
 */

/**
 * Checks if a string is a valid, safe Figma URL (file, design, proto)
 */
export function isFigmaUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = String(url).trim();
  if (!clean) return false;

  try {
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const host = parsed.hostname.toLowerCase();
    const isFigmaHost = host === 'figma.com' || host.endsWith('.figma.com');
    return isFigmaHost && (parsed.protocol === 'https:' || parsed.protocol === 'http:');
  } catch {
    return false;
  }
}

/**
 * Sanitizes any external URL to prevent XSS (javascript:, data:, vbscript:)
 */
export function sanitizeUrl(url?: string | null, fallback: string = '#'): string {
  if (!url) return fallback;
  const clean = String(url).trim();
  if (!clean || clean === '-' || clean === '–' || clean === '—') return fallback;

  // Allow anchor hashes
  if (clean.startsWith('#')) return clean;

  try {
    const parsed = new URL(clean.startsWith('http') || clean.startsWith('mailto:') || clean.startsWith('tel:') ? clean : `https://${clean}`);
    if (['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return parsed.toString();
    }
  } catch {
    // URL parsing failed
  }
  return fallback;
}

/**
 * Normalizes any Figma URL (share link, prototype link, design link) into a secure embeddable iframe src
 * Reference: https://www.figma.com/developers/embed
 */
export function getFigmaEmbedSrc(rawUrl?: string | null): string | null {
  if (!rawUrl || !isFigmaUrl(rawUrl)) return null;
  const clean = String(rawUrl).trim();

  try {
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const host = parsed.hostname.toLowerCase();

    // If already a valid figma embed url
    if (host === 'embed.figma.com') {
      return parsed.toString();
    }

    // Standard figma.com URL (file, proto, design)
    if (host === 'figma.com' || host === 'www.figma.com') {
      return `https://embed.figma.com/proto?url=${encodeURIComponent(parsed.toString())}&scaling=contain&embed-host=share`;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Normalizes any Figma URL to open directly in Figma (new tab or app)
 */
export function getFigmaDirectUrl(project: { figmaUrl?: string; figmaEmbedUrl?: string; liveLink?: string }): string | null {
  if (project.figmaUrl && isFigmaUrl(project.figmaUrl)) {
    return project.figmaUrl;
  }

  // Extract from figmaEmbedUrl if it has &url=...
  if (project.figmaEmbedUrl && isFigmaUrl(project.figmaEmbedUrl)) {
    try {
      const parsed = new URL(project.figmaEmbedUrl);
      const targetUrl = parsed.searchParams.get('url');
      if (targetUrl && isFigmaUrl(targetUrl)) {
        return decodeURIComponent(targetUrl);
      }
      if (project.figmaEmbedUrl.includes('embed.figma.com/proto/')) {
        return project.figmaEmbedUrl.replace('embed.figma.com/proto/', 'www.figma.com/proto/');
      }
    } catch {}
    return project.figmaEmbedUrl;
  }

  if (project.liveLink && isFigmaUrl(project.liveLink)) {
    return project.liveLink;
  }

  return null;
}
