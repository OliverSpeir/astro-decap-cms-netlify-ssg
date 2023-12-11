import { Plugin } from 'vite';

const templateModuleId = 'virtual:astro-decap-cms/template';
const resolvedTemplateModuleId = '\0' + templateModuleId;

export function injectTemplatePlugin(templatePath: string): Plugin {
  return {
    name: 'vite-plugin-decap-cms-template',
    resolveId(id) {
      if (id === templateModuleId) {
        return resolvedTemplateModuleId;
      }
    },
    load(id) {
      if (id === resolvedTemplateModuleId) {
        return `export default ${JSON.stringify(templatePath)};`;
      }
    }
  };
}
