export function injectCSSPlugin(options) {
    return {
        name: 'inject-css',
        transformIndexHtml(html, { filename }) {
            if (filename.endsWith('admin.astro') && options.styles) {
                const stylesArray = Array.isArray(options.styles) ? options.styles : [options.styles];
                const injectedScripts = stylesArray.map(style => `<script>CMS.registerPreviewStyle("${style}");</script>`).join('');
                return html.replace('</body>', `${injectedScripts}</body>`);
            }
            return html;
        }
    };
}