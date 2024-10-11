import sharp from 'sharp';
import Image from '@11ty/eleventy-img';
import path from 'node:path';
import { PATH_PREFIX } from './constants.js';

// optimize image sizes and create lazy-load ready html elements
// h/t https://maw.sh/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
export async function imageShortcode(src, alt) {
  const stats = await Image(src, {
    widths: [512, 1024],
    formats: ['jpeg', 'webp'],
    urlPath: '/assets/img/',
    outputDir: './_site/assets/img/',
  });

  const lowestSrc = stats['jpeg'][0];

  const sourceSet = {};
  for (let fmt in stats) {
    sourceSet[fmt] = stats[fmt]
      .map(({ srcset }) => path.resolve(`${PATH_PREFIX}${srcset}`))
      .join(',');
  }

  const placeholder = await sharp(lowestSrc.outputPath)
    .resize({ fit: sharp.fit.inside })
    .blur(35)
    .toBuffer();

  const base64Placeholder = `data:image/png;base64, ${placeholder.toString('base64')}`;
  const source = `<source 
    type="image/webp"
    data-srcset="${sourceSet['webp']}"
    data-sizes="(min-width: 1024px) 1024px, 100vw"
  >`;

  const img = `<img
    class="lazy"
    alt="${alt}"
    src="${base64Placeholder}"
    data-src="${lowestSrc.url}"
    data-sizes="(min-width: 1024px) 1024px, 100vw"
    data-srcset="${sourceSet['jpeg']}"
    width="${lowestSrc.width}"
    height="${lowestSrc.height}"
  >`;

  return `<div class="image-wrapper"><picture>${source}${img}</picture></div>`;
}