import { defineConfig } from "vite";
import circularDependency from "vite-plugin-circular-dependency";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5174,
  },
  plugins: [
    circularDependency({
      circleImportThrowErr: true,
    }),
  ],
});
