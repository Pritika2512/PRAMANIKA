import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sites } from "@openai/sites-vite-plugin";
import { appConfig } from "./src/config/appConfig.js";
import { themeConfig } from "./src/config/themeConfig.js";

// Browser metadata uses the same configuration as the UI.
const appMetadata = {
  name: "app-metadata",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      const escape = (value) =>
        String(value)
          .replaceAll("&", "&amp;")
          .replaceAll('"', "&quot;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
      return html
        .replaceAll(
          "%APP_TITLE%",
          escape(appConfig.name + " | " + appConfig.projectCode),
        )
        .replaceAll("%APP_DESCRIPTION%", escape(appConfig.description))
        .replaceAll("%PRIMARY_COLOR%", escape(themeConfig.primary));
    },
  },
};

export default defineConfig({
  plugins: [appMetadata, react(), tailwindcss(), sites()],
});
