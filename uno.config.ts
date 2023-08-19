// uno.config.ts
import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
});
