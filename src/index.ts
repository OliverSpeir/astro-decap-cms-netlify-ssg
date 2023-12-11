import type { AstroIntegration } from "astro";
import type { CmsConfig } from "./types";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dump } from "js-yaml";
import { injectCSSPlugin } from "./decap-vite-plugin-styles.js";
import { injectTemplatePlugin } from "./decap-vite-plugin-templates.js";

export interface DecapCMSOptions {
  adminRoute?: string;
  config?: CmsConfig;
  styles?: string[];
  templates?: string;
  injectWidget?: boolean;
}

const defaultOptions: DecapCMSOptions = {
  adminRoute: "/admin",
  injectWidget: true,
};

export default function decapCMS(options?: DecapCMSOptions): AstroIntegration {
  const { adminRoute, config, styles, templates, injectWidget } = {
    ...defaultOptions,
    ...options,
  };
  if (!adminRoute?.startsWith("/")) {
    throw new Error('`adminRoute` option must start with "/"');
  }
  return {
    name: "decap-cms",
    hooks: {
      // 1. inject admin route
      "astro:config:setup": ({ injectRoute, injectScript, updateConfig, config }) => {
        console.log("updating config")
        updateConfig({
          site: config.site || process.env.URL,
          vite: {
            plugins: [
              ...(config.vite?.plugins || []),
              injectCSSPlugin(styles),
              injectTemplatePlugin(templates)
            ],
          }
        });
        console.log("vite plugins =", config.vite)
        console.log("injecting route")
        injectRoute({
          pattern: adminRoute,
          entrypoint: "astro-decap-cms-netlify-ssg/src/admin.astro",
        });
        // 2. inject indetity widget
        // this should only be injected to / ( root of website )
        // adds a script in this way for performance reasons ( module makes inline script )
        if (injectWidget) {
          injectScript(
            "page",
            `
            window.onload = function() {
              var script = document.createElement('script');
              script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
              document.head.appendChild(script);
            };
        `
          );
        }

        // 4. inject templates
        // should only be injected to /admin
        // hardcoded for now
        // ideally would be able to build this createClass function programatically 
        //  e.g accept and object of the widgets you want to add and classes you need applied to them 
        // applying prose class only necessary for tailwind typography
      },
      // 4. create config
      // creates file yaml at /admin/config.yml from object passed to the integration
      "astro:build:done": async ({ dir }) => {
        if (config) {
          function convertConfigToYaml(configObj: CmsConfig) {
            try {
              return dump(configObj);
            } catch (e) {
              console.error(e);
              return null;
            }
          }

          try {
            const yamlContent = convertConfigToYaml(config);
            if (yamlContent) {
              const outputPath = fileURLToPath(
                new URL("./admin/config.yml", dir)
              );
              await writeFile(outputPath, yamlContent, "utf8");
              console.log("config.yml file created successfully in /dist");
            } else {
              console.error("Failed to convert config to YAML.");
            }
          } catch (error) {
            console.error("Error writing config.yml:", error);
          }
        }
      },
    },
  };
}
