import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type BlogPost = GetTypeByName<typeof configuration, "BlogPost">;
export declare const allBlogPosts: Array<BlogPost>;

export type ChangelogPost = GetTypeByName<typeof configuration, "ChangelogPost">;
export declare const allChangelogPosts: Array<ChangelogPost>;

export type CustomersPost = GetTypeByName<typeof configuration, "CustomersPost">;
export declare const allCustomersPosts: Array<CustomersPost>;

export type HelpPost = GetTypeByName<typeof configuration, "HelpPost">;
export declare const allHelpPosts: Array<HelpPost>;

export {};
