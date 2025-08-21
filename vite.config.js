import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // 生成更好的文件名用于SEO和缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `assets/img/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          if (/\.css$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
        // 代码拆分优化
        manualChunks: {
          // 核心库单独打包
          'react-vendor': ['react', 'react-dom'],
          // 国际化相关
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector']
        }
      }
    },
    // 启用预压缩
    assetsInlineLimit: 4096, // 4KB以下的资源内联
    cssCodeSplit: true, // CSS代码分割
    reportCompressedSize: false, // 禁用压缩大小报告以提升构建速度
  },
  // 确保静态文件被正确复制到构建目录
  publicDir: 'public',
  // 预渲染配置
  ssr: {
    // 为SSR准备的配置
    noExternal: []
  },
  // 生产环境优化
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  // 预构建优化
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['crypto']
  }
})