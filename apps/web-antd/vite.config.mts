import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://121.41.179.129:10012/v1',
            // target: 'http://121.41.179.129:10002/v1',
            // target: 'http://192.168.102.186:8077/v1',
            ws: true,
          },
        },
      },
    },
  };
});
