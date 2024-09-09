// types.ts
import { z } from "zod";

// Define TypeScript types
export type Event = {
  id: string;
  name: string;
  channelId: string;
  userId: string;
  icon: string;
  notify: boolean;
  tags: Record<string, unknown>;
  createdAt: string;
};

export type ChannelDetails = {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
  };
  events: Event[];
};

// Define Zod schemas
export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  channelId: z.string(),
  userId: z.string(),
  icon: z.string(),
  notify: z.boolean(),
  tags: z.record(z.unknown()),
  createdAt: z.string(),
});

export const channelDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  createdAt: z.string(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    userId: z.string(),
    createdAt: z.string(),
  }),
  events: z.array(eventSchema),
});

// Assuming you have a types file, e.g., types.ts
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  fnr: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  workspaceId: string;
  tenantId: string;
  landlordOrgnr: number;
  landlordName: string;
  contractType: string | null;
  propertyId: string;
  buildingId: string;
  contactId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  startDate: Date;
  endDate: Date;
  negotiationDate: Date | null;
  isRenewable: boolean;
  renewablePeriod: number | null;
  indexationType: string;
  indexValue: number;
  indexationDate: Date;
  baseRent: number;
  rentPeriod: string | null;
  vatTerms: string | null;
  businessCategory: string | null;
  collateral: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantDetails {
  id: string;
  name: string;
  orgnr: number;
  numEmployees: number;
  buildingId: string;
  floorId: string | null;
  officeSpaceId: string | null;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  building: {
    id: string;
    name: string;
    address: string;
    gnr: number;
    bnr: number;
    snr: number;
    fnr: number;
    workspaceId: string;
    propertyId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  property: {
    id: string;
    name: string;
    type: string;
    orgnr: number | null;
    workspaceId: string;
    accountingId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  contacts: Contact[];
  contracts: Contract[];
}
