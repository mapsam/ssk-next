import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PATH_PREFIX } from './constants.js';

export async function featuredImageShortcode(src) {
  const width = 400;
  const height = 256;

  const image = sharp(src).resize({
    fit: sharp.fit.cover,
    width,
    height,
  });

  const featuredImage = await image.toFormat('jpeg').toBuffer();
  const placeholder = await image.blur(35).toBuffer();
  const base64Placeholder = `data:image/png;base64, ${placeholder.toString('base64')}`;
  const [filename, suffix] = path.basename(src).split('.');
  const outputUrl = `./_site/assets/img/${filename}_featured.${suffix}`;
  const url = path.join(
    PATH_PREFIX,
    `/assets/img/${filename}_featured.${suffix}`,
  );

  await mkdir('./_site/assets/img/', { recursive: true });
  await writeFile(outputUrl, featuredImage);

  const img = `<img
    class="lazy"
    alt="featured-image"
    src="${base64Placeholder}"
    data-src="${url}"
    width="${width}"
    height="${height}"
  >`;

  return `<div class="featured-image">${img}</div>`;
}