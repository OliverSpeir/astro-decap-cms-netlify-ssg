var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
;
const defaultOptions = {
    adminRoute: "/admin",
    injectWidget: true,
};
export default function decapCMS(options) {
    const { adminRoute, config, styles, templates, injectWidget } = Object.assign(Object.assign({}, defaultOptions), options);
    if (!(adminRoute === null || adminRoute === void 0 ? void 0 : adminRoute.startsWith("/"))) {
        throw new Error('`adminRoute` option must start with "/"');
    }
    return {
        name: "decap-cms",
        hooks: {
            // 1. inject admin route
            "astro:config:setup": ({ injectRoute, injectScript }) => __awaiter(this, void 0, void 0, function* () {
                injectRoute({
                    pattern: adminRoute,
                    entryPoint: "astro-decap-cms-netlify-ssg/src/admin.astro",
                });
                // 2. inject indetity widget
                if (injectWidget) {
                    injectScript("head-inline", `
          <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        `);
                }
                // 3. inject styles
                if (styles) {
                    injectScript("page", `
          <script>CMS.registerPreviewStyle(${styles});</script>
          `);
                }
                // 4. inject templates
                // hardcoded for now
                if (templates) {
                    injectScript("page", `
          <script>
          var CustomPreview = createClass({
            render: function () {
              var entry = this.props.entry;
              return h("div", { className: "prose" }, this.props.widgetFor("body"));
            },
          });
          CMS.registerPreviewTemplate("blog", CustomPreview);</script>
          `);
                }
            }),
            // 4. create config
            // not working yet
            "astro:build:done": ({ dir }) => __awaiter(this, void 0, void 0, function* () {
                if (config) {
                    const configContent = `# Your config.yml content here`;
                    try {
                        const outputPath = fileURLToPath(new URL("./config.yml", dir));
                        yield writeFile(outputPath, configContent);
                        console.log("config.yml file created successfully in /dist");
                    }
                    catch (error) {
                        console.error("Error writing config.yml:", error);
                    }
                }
            }),
        },
    };
}
