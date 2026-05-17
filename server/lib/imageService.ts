import axios from "axios";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as crypto from "crypto";
import { detectFaces } from "./aiClient.js";

/**
 * =========================
 * 🖼️ IMAGE SERVICE (Pexels + Pixabay + R2)
 * =========================
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

/**
 * [P-02] Extract device info (Make/Model) for experience verification
 */
export async function extractDeviceInfo(buffer: Buffer): Promise<string | null> {
  try {
    const metadata = await sharp(buffer).metadata();
    // sharp metadata might contain 'exif' buffer, but 'format' and some basics are easier
    // For deeper EXIF parsing, we'd need a parser, but let's try to get what we can safely
    // Sharp sometimes populates 'make' and 'model' in metadata for certain formats
    const { make, model } = (metadata as any);
    if (make || model) {
      return `${make || ''} ${model || ''}`.trim();
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = (process.env.R2_ACCOUNT_ID || "").trim();
const R2_ACCESS_KEY_ID = (process.env.R2_ACCESS_KEY_ID || "").trim();
const R2_SECRET_ACCESS_KEY = (process.env.R2_SECRET_ACCESS_KEY || "").trim();
const R2_BUCKET_NAME = (process.env.R2_BUCKET_NAME || "blog-images").trim();
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").trim(); // e.g., https://pub-xxx.r2.dev

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Cloudflare R2 account endpoints work best with path-style (bucket in path)
});

// Keep track of recently used images to prevent duplicates in the same post/session
const recentlyUsedImages = new Set<string>();

/**
 * Search image from Pexels (Main)
 */
async function searchPexels(query: string, page: number = 1): Promise<string | null> {
  if (!PEXELS_API_KEY) return null;
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      // [Speed Optimization] Request landscape orientation for faster fitting and better layout
      params: { query, per_page: 30, page, orientation: "landscape" },
      headers: { Authorization: PEXELS_API_KEY }
    });
    const photos = res.data.photos;
    if (photos && photos.length > 0) {
      // [Diversity Fix] Better shuffling for series context
      const shuffled = photos.sort(() => Math.random() - 0.5);
      
      for (const photo of shuffled) {
        const url = photo.src.large || photo.src.medium;
        if (!recentlyUsedImages.has(url)) {
          recentlyUsedImages.add(url);
          // Keep set small but efficient for series (max 100 for recent memory)
          if (recentlyUsedImages.size > 200) {
            const firstItem = recentlyUsedImages.values().next().value;
            if(firstItem) recentlyUsedImages.delete(firstItem);
          }
          return url;
        }
      }
      // Fallback to purely random if all are used
      const photo = photos[Math.floor(Math.random() * photos.length)];
      return photo.src.large || photo.src.medium;
    }
  } catch (e) {
    console.error("[Pexels Error]", e);
  }
  return null;
}

/**
 * Search image from Pixabay (Fallback)
 */
async function searchPixabay(query: string): Promise<string | null> {
  if (!PIXABAY_API_KEY) return null;
  try {
    const res = await axios.get("https://pixabay.com/api/", {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: 40
      }
    });
    const hits = res.data.hits;
    if (hits && hits.length > 0) {
      const shuffled = hits.sort(() => Math.random() - 0.5);
      for (const hit of shuffled) {
        const url = hit.largeImageURL || hit.webformatURL;
        if (!recentlyUsedImages.has(url)) {
          recentlyUsedImages.add(url);
          if (recentlyUsedImages.size > 100) {
            const firstItem = recentlyUsedImages.values().next().value;
            if(firstItem) recentlyUsedImages.delete(firstItem);
          }
          return url;
        }
      }
      const hit = hits[Math.floor(Math.random() * hits.length)];
      return hit.largeImageURL || hit.webformatURL;
    }
  } catch (e) {
    console.error("[Pixabay Error]", e);
  }
  return null;
}

/**
 * Apply mosaic to detected face regions
 */
async function applyMosaic(buffer: Buffer, boxes: any[]): Promise<Buffer> {
  if (!boxes || boxes.length === 0) return buffer;

  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 562;

    let currentBuffer = buffer;

    for (const box of boxes) {
      // box format: [ymin, xmin, ymax, xmax] (0-1000)
      const [ymin, xmin, ymax, xmax] = box;
      const top = Math.floor((ymin / 1000) * height);
      const left = Math.floor((xmin / 1000) * width);
      const regionWidth = Math.floor(((xmax - xmin) / 1000) * width);
      const regionHeight = Math.floor(((ymax - ymin) / 1000) * height);

      if (regionWidth <= 0 || regionHeight <= 0) continue;

      try {
        // Extract, blur/pixelate, and composite back
        const mosaicRegion = await sharp(buffer)
          .extract({ left, top, width: regionWidth, height: regionHeight })
          .resize(16, 16, { fit: 'fill' }) // Resize down for pixelation
          .resize(regionWidth, regionHeight, { kernel: 'nearest' }) // Resize back up
          .toBuffer();

        currentBuffer = await sharp(currentBuffer)
          .composite([{ input: mosaicRegion, top, left }])
          .toBuffer();
      } catch (e) {
        console.warn("[ImageService] Region processing failed, skipping box:", e);
      }
    }

    return currentBuffer;
  } catch (err) {
    console.error("[ImageService] applyMosaic main failed:", err);
    return buffer;
  }
}

/**
 * [E-01] Apply a subtle 'Nano Stamp' to verify experience and build Maza asset authority
 */
async function applyNanoStamp(buffer: Buffer): Promise<Buffer> {
  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 1200;

    // Subtle 'MAZA EXPERIENCE' signature (5% opacity)
    const svgOverlay = `
      <svg width="${width}" height="${height}">
        <style>
          .stamp { fill: white; fill-opacity: 0.15; font-family: sans-serif; font-weight: 900; font-style: italic; }
        </style>
        <text x="${width - 160}" y="${height - 30}" class="stamp" font-size="14">MAZA EXPERIENCE</text>
        <rect x="${width - 175}" y="${height - 48}" width="150" height="24" rx="12" fill="white" fill-opacity="0.05" />
      </svg>
    `;

    return await sharp(buffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .toBuffer();
  } catch (err) {
    console.error("[ImageService] applyNanoStamp failed:", err);
    return buffer;
  }
}

/**
 * [Method A] Create a branded thumbnail by overlaying title text on an image
 */
async function createThumbnailWithText(buffer: Buffer, title: string): Promise<Buffer> {
  try {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 675;

    // Clean title for display (max 45 chars)
    const displayTitle = title.length > 45 ? title.substring(0, 42) + "..." : title;

    // Split title into two lines if it's too long
    const words = displayTitle.split(' ');
    let line1 = displayTitle;
    let line2 = "";
    if (words.length > 4 && displayTitle.length > 20) {
      line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    }

    // SVG Overlay: Gradient background + White Title + Badge
    const svgOverlay = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:black;stop-opacity:0" />
            <stop offset="100%" style="stop-color:black;stop-opacity:0.9" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.5"/>
          </filter>
        </defs>
        
        <!-- Bottom Gradient Overlay for Text Readability -->
        <rect x="0" y="${height * 0.4}" width="${width}" height="${height * 0.6}" fill="url(#textGrad)" />
        
        <!-- Premium Badge -->
        <g transform="translate(60, 60)" filter="url(#shadow)">
          <rect width="200" height="40" rx="20" fill="#6366f1" />
          <circle cx="25" cy="20" r="6" fill="#fff" class="animate-pulse" />
          <text x="45" y="25" font-family="sans-serif" font-size="14" font-weight="900" fill="white" letter-spacing="1">EXPERIENCE VERIFIED</text>
        </g>
        
        <!-- Main Title (Support for 2 lines if needed) -->
        <g transform="translate(60, ${height - 120})" filter="url(#shadow)">
          <text font-family="sans-serif" font-size="58" font-weight="900" fill="white" letter-spacing="-1">
            ${line2 ? `<tspan x="0" dy="-65">${line1}</tspan><tspan x="0" dy="75">${line2}</tspan>` : `<tspan x="0" y="40">${line1}</tspan>`}
          </text>
        </g>

        <!-- Brand Identifier -->
        <text x="${width - 60}" y="${height - 60}" text-anchor="end" font-family="sans-serif" font-size="16" font-weight="900" fill="white" fill-opacity="0.6">MAZA STUDIO</text>
      </svg>
    `;

    return await sharp(buffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .toBuffer();
  } catch (err) {
    console.error("[ImageService] createThumbnailWithText failed:", err);
    return buffer;
  }
}

/**
 * Process image: Download -> [Optional Text Overlay] -> Convert to WebP -> Upload to R2
 */
async function processAndUpload(imageUrl: string, title?: string): Promise<string | null> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    let finalBuffer = buffer;

    // 1. [Privacy] Face Mosaic
    try {
      const boxes = await detectFaces(buffer.toString("base64"));
      if (boxes && boxes.length > 0) {
        finalBuffer = await applyMosaic(finalBuffer, boxes);
      }
    } catch (detectErr) {
      console.warn("[ImageService] Face detection failed:", detectErr);
    }

    // 2. [Thumbnail] Add Title Text if provided (Method A)
    if (title) {
      finalBuffer = await createThumbnailWithText(finalBuffer, title);
    }

    // 3. [Nano Stamp] Apply subtle Maza signature
    finalBuffer = await applyNanoStamp(finalBuffer);

    // 4. [Optimization] WebP Conversion (SEO & Speed + P-01 Metadata Scrubbing)
    const webpBuffer = await sharp(finalBuffer)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ 
        quality: 75, 
        effort: 6,
        smartSubsample: true
      })
      .toBuffer();

    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
      console.warn("[ImageService] R2 Configuration missing. Returning base64 thumbnail.");
      return `data:image/webp;base64,${webpBuffer.toString("base64")}`;
    }

    const hash = crypto.createHash("md5").update(webpBuffer).digest("hex");
    const fileName = `images/${title ? 'thumb_' : ''}${hash}.webp`;

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: webpBuffer,
      ContentType: "image/webp",
    }));

    return `${R2_PUBLIC_URL}/${fileName}`;
  } catch (e) {
    console.error("[Image Upload Error] Falling back to original URL:", e);
    return imageUrl;
  }
}

/**
 * Upload a raw buffer to R2 (used for Photo Mode)
 */
export async function uploadBufferToR2(buffer: Buffer, mimeType: string = "image/jpeg", title?: string): Promise<{url: string, device: string | null} | null> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    console.warn("[ImageService] R2 Configuration missing. Falling back to base64.");
    return { url: `data:${mimeType};base64,${buffer.toString("base64")}`, device: null }; 
  }

  try {
    let mosaicBuffer = buffer;
    try {
      const boxes = await detectFaces(buffer.toString("base64"));
      if (boxes && boxes.length > 0) {
        mosaicBuffer = await applyMosaic(buffer, boxes);
      }
    } catch (detectErr) {
      console.warn("[ImageService] Face detection failed:", detectErr);
    }

    // [Thumbnail] Add Title Text if provided (Method A)
    if (title) {
      mosaicBuffer = await createThumbnailWithText(mosaicBuffer, title);
    }

    // [Nano Stamp] Apply subtle Maza signature for asset authority
    mosaicBuffer = await applyNanoStamp(mosaicBuffer);

    const webpBuffer = await sharp(mosaicBuffer)
      .rotate() // 아이폰 등 기기 회전 정보 반영
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // 최대 1200px 유지하면서 비율 보존
      .webp({ 
        quality: 75, // 구글 SEO 권장 최적 압축률
        effort: 6,   // 압축 효율 극대화 (최대치)
        smartSubsample: true 
      })
      .toBuffer();

    const hash = crypto.createHash("md5").update(webpBuffer).digest("hex");
    const fileName = `images/photo_${hash}.webp`;

    // [P-02] Extract device info before it's scrubbed
    const device = await extractDeviceInfo(buffer);

    await s3Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: webpBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable" // 캐싱 최적화 추가
    }));

    return { 
      url: `${R2_PUBLIC_URL}/${fileName}`,
      device: device || null
    };
  } catch (e) {
    console.error("[Image Upload Error] Falling back to base64:", e);
    return { 
      url: `data:${mimeType};base64,${buffer.toString("base64")}`,
      device: null
    };
  }
}

/**
 * Main Entry Point: Get optimized image URL for a keyword
 */
export async function getOptimizedImage(keyword: string, title?: string): Promise<string> {
  console.log(`🖼️ Searching image for: ${keyword} ${title ? '(with title overlay)' : ''}`);
  
  const safeKeyword = keyword || "modern lifestyle";
  const PERSON_KEYWORDS = ['author', 'blogger', 'staff', 'person', 'portrait', 'people', 'writer', 'expert', 'professional'];
  const isPersonImage = PERSON_KEYWORDS.some(k => safeKeyword.toLowerCase().includes(k));
  
  // [Diversity Fix] Add random suffixes + title context to search query
  const SUFFIXES = [
    'abstract', 'tech', 'work', 'life', 'modern', 'clean', 'detail', 'concept', 
    'minimal', 'business', 'creative', 'nature', 'design', 'urban', 'interior',
    'macro', 'perspective', 'lifestyle', 'pro', 'expert', 'global'
  ];
  
  const getQueries = () => {
    const randomSuffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const titleContext = title ? title.split(' ').filter(w => w.length > 1).slice(0, 3).join(' ') : '';
    
    if (isPersonImage) {
      return [`Korean ${keyword} portrait`, `Asian ${keyword} professional`, `${keyword} person working`];
    }
    
    return [
      `${titleContext || keyword} ${randomSuffix}`,
      `${keyword} high resolution`,
      `${keyword} conceptual`,
      titleContext || keyword
    ];
  };

  const queries = getQueries();
  let url: string | null = null;

  // [Aggressive Fallback Loop]
  for (const query of queries) {
    console.log(`[ImageService] Trying query: ${query}`);
    // 1. Pexels (Main)
    url = await searchPexels(query, Math.floor(Math.random() * 5) + 1);
    if (url) break;

    // 2. Pixabay (Fallback)
    url = await searchPixabay(query);
    if (url) break;
  }
  
  if (!url) {
    const CURATED_FALLBACKS = [
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
    ];
    url = CURATED_FALLBACKS[Math.floor(Math.random() * CURATED_FALLBACKS.length)];
  }

  const finalUrl = await processAndUpload(url, title);
  return finalUrl || url;
}
