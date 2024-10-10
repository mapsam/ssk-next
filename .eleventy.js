import sharp from 'sharp';
import Image from '@11ty/eleventy-img';
import esbuild from 'esbuild';
import { writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

export default function (conf) {
	// copy css
	conf.addPassthroughCopy('assets/css');
	
	// bundle javascript
	conf.addTemplateFormats('js');
	conf.on('eleventy.before', async () => {
    await esbuild.build({
      entryPoints: ['assets/js/ssk.js'],
      bundle: true,
      outfile: '_site/assets/js/bundle.js',
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    });
  });

	// featured image shortcode
	conf.addShortcode('featuredimage', async function(src) {
		const width = 400;
		const height = 256;

		const image = sharp(src)
			.resize({ 
				fit: sharp.fit.cover,
				width,
				height,
			});

		const featuredImage = await image.toFormat('jpeg').toBuffer();
		const placeholder = await image.blur(35).toBuffer();
		const base64Placeholder = `data:image/png;base64, ${placeholder.toString('base64')}`;
		const [filename, suffix] = basename(src).split('.');
		const outputUrl = `./_site/assets/img/${filename}_featured.${suffix}`;
		const url = `/assets/img/${filename}_featured.${suffix}`
		
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
	});

	// optimize image sizes and create lazy-load ready html elements
	// h/t https://maw.sh/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
	conf.addShortcode('image', async function (src, alt, featured = false) {
		const stats = await Image(src, {
      widths: [512, 1024],
      formats: ['jpeg', 'webp'],
      urlPath: '/assets/img/',
      outputDir: './_site/assets/img/',
    });

    const lowestSrc = stats['jpeg'][0];

    const srcset = Object.keys(stats).reduce(
      (acc, format) => ({
        ...acc,
        [format]: stats[format].reduce(
          (_acc, curr) => `${_acc} ${curr.srcset} ,`,
          '',
        ),
      }),
      {},
    );

		const placeholder = await sharp(lowestSrc.outputPath)
			.resize({ fit: sharp.fit.inside })
			.blur(35)
			.toBuffer();

		const base64Placeholder = `data:image/png;base64, ${placeholder.toString('base64')}`;
    const source = `<source 
			type="image/webp"
			data-srcset="${srcset['webp']}"
			data-sizes="(min-width: 1024px) 1024px, 100vw"
		>`;

    const img = `<img
			class="lazy"
			alt="${alt}"
			src="${base64Placeholder}"
			data-src="${lowestSrc.url}"
			data-sizes="(min-width: 1024px) 1024px, 100vw"
			data-srcset="${srcset['jpeg']}"
			width="${lowestSrc.width}"
			height="${lowestSrc.height}"
		>`;

    return `<div class="image-wrapper"><picture>${source}${img}</picture></div>`;
	});
};
