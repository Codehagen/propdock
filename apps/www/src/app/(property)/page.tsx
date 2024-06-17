import { redirect } from "next/navigation";
import { getUserCredits } from "@/actions/Dingify/get-credits";
import { getEventStats } from "@/actions/stats/get-events-stats";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AddApiKeyButton } from "@/components/buttons/AddApiKeyButton";
import { AddChannelButton } from "@/components/buttons/AddChannelButton";
import { AddProjectButton } from "@/components/buttons/AddProjectButton";
import { AddPropertyButton } from "@/components/buttons/AddPropertyButton";
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton";
import EventsDashboard from "@/components/dashboard/EventsDashboard";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = {
  title: "Dingify Dashboard - Your Alerts Overview",
  description:
    "Monitor and analyze all your critical events in real-time. Access key metrics, track important journeys, and make data-driven decisions to optimize your business performance on the Dingify Dashboard.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userCredits = await getUserCredits();
  const eventStats = await getEventStats();

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
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
  });

  // Fetch projects associated with the user
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  // Extract project IDs
  const projectIds = projects.map((project) => project.id);

  // Fetch customers associated with the user's projects
  const customers = await prisma.customer.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
  });
  console.log(customers);

  // Fetch channels for the user's projects
  const channels = await prisma.channel.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Extract channel IDs
  const channelIds = channels.map((channel) => channel.id);

  // Fetch events for the user's channels with project and channel names
  const events = await prisma.event.findMany({
    where: {
      channelId: {
        in: channelIds,
      },
    },
    select: {
      id: true,
      name: true,
      channelId: true,
      userId: true,
      icon: true,
      tags: true,
      notify: true,
      createdAt: true,
      customerId: true,
      channel: {
        select: {
          name: true,
          project: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Ensure userCredits.credits is defined, default to 0 if undefined
  const availableCredits = userCredits.credits ?? 0;

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="">
        {userWorkspace ? (
          availableCredits > 0 ? (
            <AddProjectButton />
          ) : (
            <AddChannelButton />
          )
        ) : (
          <AddWorkspaceButton />
        )}
      </DashboardHeader>
      <div>
        {userWorkspace ? (
          channels.length === 0 ? (
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
            <EventsDashboard events={events} eventStats={eventStats} />
          )
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user" />
            <EmptyPlaceholder.Title>No Workspace Found</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You need to create a workspace to get started.
            </EmptyPlaceholder.Description>
            <AddWorkspaceButton />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
