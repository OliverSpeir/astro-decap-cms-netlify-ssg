import { Plugin } from 'vite';

const virtualModuleId = 'virtual:astro-decap-cms/styles';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function injectCSSPlugin(styles: string[]): Plugin {
  return {
    name: 'vite-plugin-decap-cms-styles',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(styles)};`;
      }
    }
  };
}
