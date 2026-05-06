import path from "node:path";
import sharp from "sharp";

// Convert the white-background logo into a transparent-background PNG,
// so it blends on dark sections (footer) without a white rectangle.
const inputPath = path.resolve("src/assets/veera-logo-white.png");
const outputPath = path.resolve("src/assets/veera-logo-transparent.png");

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

// Compute alpha based on "distance from white" to preserve anti-aliased edges.
// - fully transparent when extremely close to white
// - fully opaque once sufficiently far from white
const transparentCutoff = 10; // <= becomes transparent
const opaqueCutoff = 55; // >= becomes opaque

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const dist = Math.max(255 - r, 255 - g, 255 - b);

  let a;
  if (dist <= transparentCutoff) a = 0;
  else if (dist >= opaqueCutoff) a = 255;
  else a = Math.round(((dist - transparentCutoff) / (opaqueCutoff - transparentCutoff)) * 255);

  data[i + 3] = a;
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(outputPath);

console.log(`Wrote ${outputPath}`);

