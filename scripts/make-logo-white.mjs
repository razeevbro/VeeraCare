import path from "node:path";
import sharp from "sharp";

const inputPath = path.resolve("src/assets/veera-logo.png");
const outputPath = path.resolve("src/assets/veera-logo-white.png");

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

// Replace near-black background pixels with white.
// (The current logo image has the dark background baked in, not transparency.)
const threshold = 28;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  if (r < threshold && g < threshold && b < threshold) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(outputPath);

console.log(`Wrote ${outputPath}`);

