import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Use '/' if deploying to the root, or '/your-app/' for subdirectory deployment
  plugins: [react()],
});
