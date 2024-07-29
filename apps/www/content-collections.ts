import { defineCollection, defineConfig } from '@content-collections/core';
import {
  createMetaSchema,
  createDocSchema,
  transformMDX,
} from '@fumadocs/content-collections/configuration';

const docs = defineCollection({
  name: 'docs',
  directory: 'src/content/docs',
  include: '**/*.mdx',
  schema: createDocSchema,
  transform: transformMDX,
});

const metas = defineCollection({
  name: 'meta',
  directory: 'src/content/docs',
  include: '**/meta.json',
  parser: 'json',
  schema: createMetaSchema,
});

export default defineConfig({
  collections: [docs, metas],
});