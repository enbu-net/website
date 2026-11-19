// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightDotMd from "starlight-dot-md";
import starlightCopyButton from "starlight-copy-button";

// https://astro.build/config
export default defineConfig({
  site: "https://enbu.net",
  redirects: {
    "/docs/": "/en/docs/",
    "/docs.md": "/en/docs.md",
  },
  integrations: [
    starlight({
      title: "enbu",
      favicon: "/favicon.png",
      customCss: ["./src/styles/docs.css"],
      expressiveCode: { defaultProps: { wrap: true } },
      defaultLocale: "en",
      locales: {
        en: { label: "English", lang: "en" },
        ja: { label: "日本語", lang: "ja" },
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/enbu-net/enbu" }],
      sidebar: [{ autogenerate: { directory: "docs" } }],
      plugins: [starlightLlmsTxt(), starlightDotMd(), starlightCopyButton({ label: "Copy as MD" })],
    }),
  ],
});
