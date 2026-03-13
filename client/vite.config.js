import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: '0.0.0.0', // 允許區域網路內的所有裝置連線
    port: 5174 ,    // 這是 React 跑的埠口
    strictPort: true // 防止自動跳到 5175
  }
})