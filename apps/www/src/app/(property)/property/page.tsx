import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AddPropertyButton } from "@/components/buttons/AddPropertyButton"
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import { PropertyColumns } from "@/components/table/dashboard/columns"
import { DataTable } from "@/components/table/dashboard/data-table"

export const metadata = {
  title: "Propdock Dashbord - Din Eiendomsoversikt",
  description:
    "Overvåk og analyser alle dine eiendommer i sanntid. Få tilgang til nøkkelmetrikk, spor viktige hendelser, og ta datadrevne beslutninger for å optimalisere din eiendomsforvaltning med Propdock Dashbord.",
}

export default async function PropertyPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn ?? "/login")
  }

  // Fetch workspace associated with the user
  const userWorkspace = await prisma.workspace.findFirst({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!userWorkspace) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="">
          <AddWorkspaceButton />
        </DashboardHeader>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>Finn ditt workspace</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ikke lagt til et workspace ennå. Legg til et workspace for å
            komme i gang.
          </EmptyPlaceholder.Description>
          <AddWorkspaceButton />
        </EmptyPlaceholder>
      </DashboardShell>
    )
  }

  //TODO - Make function to fetch properties somewhere else
  //TODO Make types for properties
  // Fetch properties associated with the user's workspace
  const properties: any = await prisma.property.findMany({
    where: {
      workspaceId: userWorkspace.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      buildings: {
        select: {
          id: true,
          name: true,
          address: true,
          floors: {
            select: {
              maxTotalKvm: true,
            },
          },
        },
      },
      tenants: {
        select: {
          id: true,
          name: true,
        },
      },
      contracts: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
        },
      },
      analysis: {
        select: {
          id: true,
          // Add fields related to financial analysis
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Eiendommer" text="Alle dine eiendommer">
        <AddPropertyButton />
      </DashboardHeader>
      <div>
        {properties.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>
              Legg til din første eiendom
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Skriv noe her hvorfor vi trenger de å legge til første eiendom.
            </EmptyPlaceholder.Description>
            <AddPropertyButton />
          </EmptyPlaceholder>
        ) : (
          <DataTable
            type="property"
            columns={PropertyColumns}
            data={properties}
          />
        )}
      </div>
    </DashboardShell>
  )
}
