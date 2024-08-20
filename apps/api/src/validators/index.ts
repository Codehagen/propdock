import { OpenAPIHono, z } from "@hono/zod-openapi"
import * as yaml from "yaml"
import {
  createDocument,
  extendZodWithOpenApi,
  ZodOpenApiOperationObject,
} from "zod-openapi"

extendZodWithOpenApi(z)

const app = new OpenAPIHono()
const registry = app.openAPIRegistry

// User Schema
const UserSchema = z
  .object({
    id: z.number(),
    email: z.string().email(),
    workspaceId: z.string().nullable(),
    apiKey: z.string(),
  })
  .openapi({ ref: "User" })

// Property Schema
const PropertySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    workspaceId: z.string(),
  })
  .openapi({ ref: "Property" })

// Building Schema
const BuildingSchema = z
  .object({
    id: z.string(),
    propertyId: z.string(),
    // Add other relevant fields based on your application's needs
  })
  .openapi({ ref: "Building" })

// Property Create Schema
const PropertyCreateSchema = z
  .object({
    name: z.string(),
    type: z.string(),
  })
  .openapi({ ref: "PropertyCreate" })

// Building Create Schema
const BuildingCreateSchema = z
  .object({
    propertyId: z.string(),
    // Add other relevant fields based on your application's needs
  })
  .openapi({ ref: "BuildingCreate" })

// CRUD operations for Properties
const createProperty: ZodOpenApiOperationObject = {
  operationId: "createProperty",
  summary: "Create a new property",
  requestBody: {
    content: {
      "application/json": {
        schema: PropertyCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Property created successfully.",
      content: {
        "application/json": {
          schema: PropertySchema,
        },
      },
    },
    "400": {
      description: "Invalid input data.",
    },
    "500": {
      description: "Server error.",
    },
  },
}

const getAllProperties: ZodOpenApiOperationObject = {
  operationId: "getAllProperties",
  summary: "Get all properties for a workspace",
  responses: {
    "200": {
      description: "List of properties retrieved successfully.",
      content: {
        "application/json": {
          schema: z.array(PropertySchema),
        },
      },
    },
    "500": {
      description: "Server error.",
    },
  },
}

// CRUD operations for Buildings
const createBuilding: ZodOpenApiOperationObject = {
  operationId: "createBuilding",
  summary: "Create a new building",
  requestBody: {
    content: {
      "application/json": {
        schema: BuildingCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Building created successfully.",
      content: {
        "application/json": {
          schema: BuildingSchema,
        },
      },
    },
    "400": {
      description: "Invalid input data.",
    },
    "500": {
      description: "Server error.",
    },
  },
}

const getAllBuildings: ZodOpenApiOperationObject = {
  operationId: "getAllBuildings",
  summary: "Get all buildings for a workspace",
  responses: {
    "200": {
      description: "List of buildings retrieved successfully.",
      content: {
        "application/json": {
          schema: z.array(BuildingSchema),
        },
      },
    },
    "500": {
      description: "Server error.",
    },
  },
}

// Generate an OpenAPI document
export function generateOpenAPIDocument() {
  return createDocument({
    openapi: "3.1.0",
    info: {
      title: "Propdock API",
      description: "API for managing properties and buildings.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://api.vegard.workers.dev",
        description: "Production server.",
      },
    ],
    paths: {
      "/properties": {
        post: createProperty,
        get: getAllProperties,
      },
      "/buildings": {
        post: createBuilding,
        get: getAllBuildings,
      },
    },
    components: {
      schemas: {
        User: UserSchema,
        Property: PropertySchema,
        Building: BuildingSchema,
        PropertyCreate: PropertyCreateSchema,
        BuildingCreate: BuildingCreateSchema,
      },
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [{ Bearer: [] }],
  })
}
