import type { AstroIntegration } from "astro";
import type { CmsConfig } from "./types";
export interface DecapCMSOptions {
    adminRoute?: string;
    config?: CmsConfig;
    styles?: string[];
    templates?: string;
    injectWidget?: boolean;
}
export default function decapCMS(options?: DecapCMSOptions): AstroIntegration;
