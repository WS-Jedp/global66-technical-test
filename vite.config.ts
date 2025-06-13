import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwiindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/global66-technical-test/", // Comment this line if you want to use the default base path or dev server
  plugins: [vue(), tailwiindcss()],
});
