/// <reference path="../src/types.d.ts" />
import type { AstroIntegration } from "astro";
import type { CmsConfig } from "decap-cms-core";
export interface DecapCMSOptions {
    adminRoute?: string;
    config?: CmsConfig;
    styles?: string;
    templates?: string;
    injectWidget?: boolean;
}
export default function decapCMS(options?: DecapCMSOptions): AstroIntegration;
