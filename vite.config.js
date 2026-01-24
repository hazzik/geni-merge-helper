import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple plugin to generate manifest
const manifestPlugin = () => {
  return {
    name: 'generate-manifest',
    writeBundle() {
      const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
      const manifestPath = resolve(__dirname, 'src/manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      
      manifest.version = pkg.version;
      
      // Access process.env directly
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
      
      const distDir = resolve(__dirname, 'dist');
      // writeBundle hooks runs after files are written, dist should exist
      fs.writeFileSync(resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
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
        name: 'GeniMergeHelper' // iife requires a name, though likely unused
      }
    }
  },
  plugins: [manifestPlugin()]
});
