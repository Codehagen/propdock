import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Doc = GetTypeByName<typeof configuration, "docs">;
export declare const allDocs: Array<Doc>;

export type Meta = GetTypeByName<typeof configuration, "meta">;
export declare const allMetas: Array<Meta>;

export {};
