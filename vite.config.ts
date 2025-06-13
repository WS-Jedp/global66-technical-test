import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwiindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/global66-technical-test/",
  plugins: [vue(), tailwiindcss()],
});
