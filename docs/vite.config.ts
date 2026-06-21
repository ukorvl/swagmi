import { defineConfig } from "vite";
import circularDependency from "vite-plugin-circular-dependency";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    circularDependency({
      circleImportThrowErr: true,
    }),
  ],
});
