import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public', 'images');
await fs.mkdir(outDir, { recursive: true });

const sources = [
  { src: 'profil.jpeg', name: 'profile' },
  { src: 'WhatsApp Image 2026-11-15 at 19.00.40.jpeg', name: 'athlete-front-double' },
  { src: 'WhatsApp Image 2026-11-15 at 19.00.40 (1).jpeg', name: 'athlete-side' },
  { src: 'WhatsApp Image 2026-11-15 at 19.00.40 (2).jpeg', name: 'athlete-front-lat' },
];

for (const { src, name } of sources) {
  const input = path.join(root, src);
  const image = sharp(input).rotate();
  const meta = await image.metadata();
  console.log(`${name}: ${meta.width}x${meta.height}`);

  for (const width of [480, 760, 1080]) {
    if (width > meta.width) continue;
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(outDir, `${name}-${width}.webp`));
  }

  await sharp(input)
    .rotate()
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(outDir, `${name}.jpg`));

  // Small blurred placeholder, inlined by the UI as a base64 background.
  const lqip = await sharp(input)
    .rotate()
    .resize({ width: 24 })
    .blur(1.2)
    .webp({ quality: 30 })
    .toBuffer();
  console.log(`  lqip ${lqip.length} bytes`);
}

const manifest = {};
for (const { name } of sources) {
  const lqip = await sharp(path.join(root, sources.find((s) => s.name === name).src))
    .rotate()
    .resize({ width: 24 })
    .blur(1.2)
    .webp({ quality: 30 })
    .toBuffer();
  manifest[name] = `data:image/webp;base64,${lqip.toString('base64')}`;
}
await fs.writeFile(
  path.join(root, 'src', 'content', 'image-lqip.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log('Wrote src/content/image-lqip.json');
