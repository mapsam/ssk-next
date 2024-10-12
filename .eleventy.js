import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import { featuredImageShortcode } from './lib/shortcode-featured-image.js';
import { imageShortcode } from './lib/shortcode-image.js';
import { specificationShortcode } from './lib/shortcode-specification.js';
import { PATH_PREFIX } from './lib/constants.js';
import esbuild from 'esbuild';

export const config = {
  pathPrefix: PATH_PREFIX,
};

export default function (conf) {
  conf.addPassthroughCopy('assets/css');
  conf.addTemplateFormats('js');
  conf.addPlugin(EleventyHtmlBasePlugin);
  conf.addCollection('projects', (coll) => coll.getFilteredByGlob('projects/**/*.md'));
  conf.addShortcode('featuredimage', featuredImageShortcode);
  conf.addShortcode('image', imageShortcode);
  conf.addShortcode('specification', specificationShortcode);
  conf.on('eleventy.before', async () => {
    await esbuild.build({
      entryPoints: ['assets/js/ssk.js'],
      bundle: true,
      outfile: '_site/assets/js/bundle.js',
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    });
  });
}
