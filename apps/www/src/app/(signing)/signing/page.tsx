import { redirect } from "next/navigation"

import { Button } from "@dingify/ui/components/button"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import { columnsSigning } from "@/components/signing/sign-table/components/columns"
import { SigningTable } from "@/components/signing/sign-table/components/data-table"
import { SignSchema } from "@/components/signing/sign-table/data/schema"

export const data: any[] = [
  {
    id: "728ed52f",
    createdAt: "23/07/2024",
    title: "Title 1",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Unsigned",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Expired",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "728ed52f",
    createdAt: "23/07/2024",
    title: "Title 1",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Unsigned",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Expired",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "728ed52f",
    createdAt: "23/07/2024",
    title: "Title 1",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Unsigned",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Expired",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
  {
    id: "489e1d42",
    email: "example@gmail.com",
    title: "Title 2",
    status: "Signed",
    downloadUrl: "https://www.google.com",
    signers: ["John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater", "John", "Bob", "Slob", "Dog", "Cat", "Priest", "Phater"]
  },
]

export default async function SigningPage() {
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

  const documents: any = await prisma.document.findMany({
    where: {
      workspaceId: userWorkspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  console.log(userWorkspace)
  
  console.log(user)

  console.log(documents)

  return (
    <DashboardShell>
      <DashboardHeader heading="Kontrakter" text="Alle dine kontrakter">
        <Button>Knapp</Button>
      </DashboardHeader>
      <div>
        {/*           {properties.length === 0 ? (
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
            // data
        )} */}
        <SigningTable data={data} columns={columnsSigning} />
      </div>
    </DashboardShell>
  )
}
