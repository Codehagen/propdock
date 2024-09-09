import type { GetTypeByName } from "@content-collections/core";
import type configuration from "../../content-collections.ts";

export type BlogPost = GetTypeByName<typeof configuration, "BlogPost">;
export declare const allBlogPosts: Array<BlogPost>;

export type ChangelogPost = GetTypeByName<
  typeof configuration,
  "ChangelogPost"
>;
export declare const allChangelogPosts: Array<ChangelogPost>;

export type CustomersPost = GetTypeByName<
  typeof configuration,
  "CustomersPost"
>;
export declare const allCustomersPosts: Array<CustomersPost>;

export type HelpPost = GetTypeByName<typeof configuration, "HelpPost">;
export declare const allHelpPosts: Array<HelpPost>;

export type LegalPost = GetTypeByName<typeof configuration, "LegalPost">;
export declare const allLegalPosts: Array<LegalPost>;

export type IntegrationsPost = GetTypeByName<
  typeof configuration,
  "IntegrationsPost"
>;
export declare const allIntegrationsPosts: Array<IntegrationsPost>;
