import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  base: '/',
  build: {
    assets: 'assets/script',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/style/[name][extname]',
          entryFileNames: `assets/script/[name].js`
        },
      },
      // CSS を分割する
      // まとめて出力する場合は false にする
      cssCodeSplit: false,
    },
  },
  integrations: [
    compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: false,
    }),
  ],
});
