# ssk vnext

Playground for the next iteration of studiosk.net.

### Architecture

- Node.js v20+
- Static site generated with 11ty
- Javascript bundled with esbuild
- Stock imagery from unsplash
- Images preprocessed with sharp and lazy loaded with vanilla-lazyload
- Deployed with GitHub Pages

### Development

```sh
npm ci          # install dependencies
npm run dev     # run development server @ http://localhost:8080
npm run build   # build site
```