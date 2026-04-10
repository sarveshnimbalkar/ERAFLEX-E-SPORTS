/**
 * ERAFLEX Smart Image Utility
 * Maps content categories to curated, relevant Unsplash images.
 * No API key required — uses direct Unsplash source URLs.
 * 
 * Usage:
 *   import { getImageByCategory } from "@/lib/imageUtils";
 *   const src = getImageByCategory("customizer");
 */

type ImageCategory =
  | "football"
  | "basketball"
  | "cricket"
  | "lifestyle"
  | "customizer"
  | "ar-tryon"
  | "general";

/**
 * Curated image pools, vetted for content relevance, quality, and aspect ratio.
 * All images are 1200–1400px wide, suitable for object-fit: cover sections.
 */
const IMAGE_POOL: Record<ImageCategory, string[]> = {
  football: [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&auto=format&fit=crop&q=80",
  ],
  basketball: [
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&auto=format&fit=crop&q=80",
  ],
  cricket: [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200&auto=format&fit=crop&q=80",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598136490941-30d885318abd?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80",
  ],
  /**
   * 2D Design Studio / Customizer section
   * Shows jersey print/customization, fashion studio, apparel design
   */
  customizer: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&auto=format&fit=crop&q=80",
  ],
  /**
   * AR Try-On section
   * Shows technology, augmented reality, digital fitting, wearable tech
   */
  "ar-tryon": [
    "https://images.unsplash.com/photo-1535223289429-462ea9301402?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616161560417-66d4db5892ec?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
  ],
  general: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&auto=format&fit=crop&q=80",
  ],
};

/**
 * Returns the primary (first) image for a category.
 * Use this for SSR-safe, deterministic rendering.
 */
export function getImageByCategory(category: ImageCategory): string {
  const pool = IMAGE_POOL[category] ?? IMAGE_POOL.general;
  return pool[0];
}

/**
 * Returns a random image from a category pool.
 * Use this for client-side refresh variety (trending sections, etc.)
 */
export function getRandomImageByCategory(category: ImageCategory): string {
  const pool = IMAGE_POOL[category] ?? IMAGE_POOL.general;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns the full pool for a category.
 */
export function getImagePool(category: ImageCategory): string[] {
  return IMAGE_POOL[category] ?? IMAGE_POOL.general;
}

/**
 * Maps a product sport string to an image category.
 * Safe fallback for unknown sport values.
 */
export function sportToImageCategory(sport: string): ImageCategory {
  const map: Record<string, ImageCategory> = {
    football: "football",
    basketball: "basketball",
    cricket: "cricket",
  };
  return map[sport.toLowerCase()] ?? "lifestyle";
}
