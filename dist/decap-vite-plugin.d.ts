import { Plugin } from 'vite';
interface AstroCssPluginOptions {
    styles: string[];
}
export declare function injectCSSPlugin(options: AstroCssPluginOptions): Plugin;
export {};
