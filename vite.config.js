import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['crypto']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        // 生成更好的文件名用于SEO
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 确保重要的静态文件被正确复制
        manualChunks: {
          vendor: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
        }
      }
    }
  },
  // 确保静态文件被正确复制到构建目录
  publicDir: 'public',
  // 预渲染配置 (如果需要可以添加预渲染插件)
  ssr: {
    // 为SSR准备的配置
    noExternal: []
  }
})