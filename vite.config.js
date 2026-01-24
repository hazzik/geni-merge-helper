import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const manifestPlugin = () => {
  return {
    name: 'generate-manifest',
    buildStart() {
      this.addWatchFile(resolve(__dirname, 'src/manifest.json'));
      this.addWatchFile(resolve(__dirname, 'package.json'));
    },
    generateBundle() {
      const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
      const manifestPath = resolve(__dirname, 'src/manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      
      manifest.version = pkg.version;
      
      const amoId = process.env.AMO_EXTENSION_ID;
      if (amoId) {
        manifest.browser_specific_settings = {
          ...manifest.browser_specific_settings,
          gecko: {
            ...manifest.browser_specific_settings.gecko,
            id: amoId.trim()
          }
        };
      }
      
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2)
      });
    }
  }
}

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.js'),
      output: {
        entryFileNames: 'main.js',
        format: 'iife', 
        name: 'GeniMergeHelper'
      }
    }
  },
  plugins: [manifestPlugin()]
});
