import { defineConfig } from 'vite';
import { resolve } from 'path';
import dns from 'dns';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl'; //include this for https


dns.setDefaultResultOrder('verbatim');


// https://vitejs.dev/config/
export default defineConfig({
   base: '',
   // plugins: [react()],
  plugins: [react(), basicSsl()], //use this for https
   server: {
      host: 'localhost',
      port: 9005,
      open: true,
      // hmr: false
   },
   build: {
      rollupOptions: {
         output: {
         entryFileNames: 'build.js',
         chunkFileNames: '[name].js',
         assetFileNames: 'assets/[name].[ext]',
         manualChunks: undefined,
         },
      },
   },
   clean: true,
   outDir: resolve(__dirname, 'dist'),
});