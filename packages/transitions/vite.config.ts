import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "transitions",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "remotion",
        "@remotion/transitions",
        "@remotion/paths",
        "@remotion/shapes"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          remotion: "Remotion",
          "@remotion/transitions": "RemotionTransitions",
          "@remotion/paths": "RemotionPaths",
          "@remotion/shapes": "RemotionShapes"
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
});
