import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function createPng(width, height, getPixelRgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with filter byte (0 = none) at start of each scanline
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Helper drawing math
function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, x1 + t * (x2 - x1), y1 + t * (y2 - y1));
}

function renderMeshTalkIcon(x, y, w, h, isMaskable = false) {
  // Normalize coordinates to [0, 1]
  const nx = x / w;
  const ny = y / h;

  // Background gradient: sleek dark tech cyberpunk gradient
  // Top-left: #0b0f19 -> Bottom-right: #1e112a with subtle purple/pink glow
  const gradT = (nx + ny) / 2;
  let bgR = Math.round(11 + gradT * 25);
  let bgG = Math.round(15 + gradT * 8);
  let bgB = Math.round(28 + gradT * 32);

  // If not maskable, give nice squircle rounded border
  let cornerRadius = 0.22;
  let alpha = 255;
  if (!isMaskable) {
    // Distance from center to box edge with rounded corners
    const cx = Math.abs(nx - 0.5);
    const cy = Math.abs(ny - 0.5);
    const r = cornerRadius;
    const innerW = 0.5 - r;
    const innerH = 0.5 - r;

    let d = 0;
    if (cx > innerW && cy > innerH) {
      d = Math.hypot(cx - innerW, cy - innerH) - r;
    } else {
      d = Math.max(cx - 0.5, cy - 0.5);
    }

    if (d > 0.005) {
      return [0, 0, 0, 0];
    } else if (d > -0.005) {
      const aa = (0.005 - d) / 0.01;
      alpha = Math.round(aa * 255);
    }
  }

  // Glowing ambient mesh radial gradient in center
  const dCenter = Math.hypot(nx - 0.5, ny - 0.48);
  const glow = Math.max(0, 1 - dCenter / 0.45);
  bgR = Math.min(255, bgR + Math.round(glow * 40));
  bgG = Math.min(255, bgG + Math.round(glow * 15));
  bgB = Math.min(255, bgB + Math.round(glow * 60));

  // Mesh Talk Icon design:
  // Center contains:
  // 1. Sleek Chat Bubble / Video badge
  // 2. Camera lens / mesh nodes connecting 3 glowing vertices:
  // Node 1: Left (0.35, 0.45), Node 2: Center-Top (0.50, 0.32), Node 3: Right (0.65, 0.45), Node 4: Bottom (0.50, 0.62)
  const scale = isMaskable ? 0.72 : 0.88;
  const mx = (nx - 0.5) / scale + 0.5;
  const my = (ny - 0.48) / scale + 0.48;

  let r = bgR, g = bgG, b = bgB;

  // Let's draw the mesh lines
  const nodes = [
    { x: 0.32, y: 0.42, color: [233, 30, 99] },   // Pink/Magenta
    { x: 0.50, y: 0.28, color: [59, 130, 246] },  // Electric Blue
    { x: 0.68, y: 0.42, color: [168, 85, 247] },  // Purple
    { x: 0.50, y: 0.58, color: [6, 182, 212] },   // Cyan
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], [0, 2]
  ];

  // Draw connecting laser beams / mesh edges
  for (const [i, j] of edges) {
    const dEdge = distToSegment(mx, my, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
    if (dEdge < 0.05) {
      const intensity = Math.max(0, 1 - dEdge / 0.05);
      const edgeGlow = Math.pow(intensity, 2);
      r = Math.min(255, r + Math.round(edgeGlow * 130));
      g = Math.min(255, g + Math.round(edgeGlow * 120));
      b = Math.min(255, b + Math.round(edgeGlow * 240));
    }
  }

  // Draw central video camera silhouette inside the mesh
  // Camera body: rounded rect centered at (0.5, 0.43), w = 0.16, h = 0.11
  const camX = Math.abs(mx - 0.47);
  const camY = Math.abs(my - 0.43);
  const inCamBody = camX < 0.08 && camY < 0.055;
  // Camera lens triangle on right
  const lensLeft = 0.55;
  const lensRight = 0.61;
  const inCamLens = mx >= lensLeft && mx <= lensRight &&
    Math.abs(my - 0.43) <= (0.02 + ((mx - lensLeft) / (lensRight - lensLeft)) * 0.035);

  if (inCamBody || inCamLens) {
    // Shiny white-to-light-pink gradient
    const camG = (mx - 0.39) / 0.22;
    r = Math.round(255 - camG * 20);
    g = Math.round(240 - camG * 40);
    b = Math.round(255 - camG * 10);
  }

  // Small camera lens circle / dot inside body
  const camLensDot = Math.hypot(mx - 0.45, my - 0.43);
  if (camLensDot < 0.022) {
    r = 30; g = 41; b = 59;
  }
  if (camLensDot < 0.012) {
    r = 56; g = 189; b = 248; // Glowing cyan center
  }

  // Draw Glowing Mesh Nodes (spheres)
  for (const node of nodes) {
    const dNode = Math.hypot(mx - node.x, my - node.y);
    // Outer halo
    if (dNode < 0.075) {
      const halo = Math.max(0, 1 - dNode / 0.075);
      r = Math.min(255, r + Math.round(halo * node.color[0] * 0.8));
      g = Math.min(255, g + Math.round(halo * node.color[1] * 0.8));
      b = Math.min(255, b + Math.round(halo * node.color[2] * 0.8));
    }
    // Solid node center
    if (dNode < 0.032) {
      const core = 1 - dNode / 0.032;
      r = Math.round(node.color[0] * (1 - core) + 255 * core);
      g = Math.round(node.color[1] * (1 - core) + 255 * core);
      b = Math.round(node.color[2] * (1 - core) + 255 * core);
    }
  }

  // Subtitle / Talk Badge "M" or soundwave arc at bottom
  // Elegant sound/connection waves at the bottom (0.5, 0.72)
  for (let wave = 1; wave <= 3; wave++) {
    const waveR = 0.06 + wave * 0.035;
    const dWave = Math.abs(Math.hypot(mx - 0.5, my - 0.65) - waveR);
    if (dWave < 0.008 && mx >= 0.40 && mx <= 0.60 && my >= 0.68) {
      const waveAlpha = (1 - (wave / 4)) * (1 - dWave / 0.008);
      r = Math.min(255, r + Math.round(waveAlpha * 233));
      g = Math.min(255, g + Math.round(waveAlpha * 30));
      b = Math.min(255, b + Math.round(waveAlpha * 99));
    }
  }

  return [r, g, b, alpha];
}

// Ensure output directories exist
const iconsDir = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating PWA Icons...');

// Generate 512x512 standard
const png512 = createPng(512, 512, (x, y, w, h) => renderMeshTalkIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);
console.log('Created icon-512x512.png');

// Generate 512x512 maskable (with full background padding for Android adaptive icons)
const pngMaskable512 = createPng(512, 512, (x, y, w, h) => renderMeshTalkIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), pngMaskable512);
console.log('Created icon-maskable-512x512.png');

// Generate 192x192 standard
const png192 = createPng(192, 192, (x, y, w, h) => renderMeshTalkIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);
console.log('Created icon-192x192.png');

// Generate 180x180 Apple Touch Icon
const pngApple = createPng(180, 180, (x, y, w, h) => renderMeshTalkIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), pngApple);
console.log('Created apple-touch-icon.png');

// Generate 48x48 Favicon PNG
const pngFavicon = createPng(48, 48, (x, y, w, h) => renderMeshTalkIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'favicon-48x48.png'), pngFavicon);
console.log('Created favicon-48x48.png');

console.log('All PWA icons generated successfully!');
