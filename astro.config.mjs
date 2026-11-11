// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightDotMd from "starlight-dot-md";
import starlightCopyButton from "starlight-copy-button";

// https://astro.build/config
export default defineConfig({
  site: "https://enbu.net",
  integrations: [
    starlight({
      title: "enbu",
      // English at the root, Japanese under /ja/, as the landing pages are.
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        ja: { label: "日本語", lang: "ja" },
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/enbu-net/enbu" }],
      sidebar: [
        {
          label: "Documentation",
          translations: { ja: "ドキュメント" },
          items: [{ autogenerate: { directory: "docs" } }],
        },
      ],
      plugins: [starlightLlmsTxt(), starlightDotMd(), starlightCopyButton({ label: "Copy as MD" })],
    }),
  ],
});
