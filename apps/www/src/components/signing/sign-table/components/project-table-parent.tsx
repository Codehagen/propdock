import { z } from "zod"



async function fetchProjects() {
  const data = await getCurrentCompanyProjects()

  return data.map((project: any) => ({
    id: project.id,
    uuid: project.uuid,
  //   user: deal.user,
  //   customer: deal.customer,
    name: project.name,
  //   description: deal.description,
  //   stage: deal.stage,
  //   status: deal.status,
  //   value: deal.value,
  //   last_updated: deal.last_updated,
  //   date_created: deal.date_created,
  //   bedrift: deal.customer_details?.name,
  //   bedrift_uuid: deal.customer_details?.uuid,
  //   est_completion: deal.est_completion,
  //   tittel: deal.name,
  //   verdi: deal.value,
  //   handler: patchHandler,
  //   list_of_users: users,
  //   customer_details: {
  //     id: deal.customer_details?.id,
  //     contact_person: deal.customer_details?.contact_person,
  //     uuid: deal.customer_details?.uuid,
  //   },
  }))
}

export async function ProjectTableParent() {
  const projects = await fetchProjects()

  return <ProjectsTable data={projects} columns={columnsProjects} />
}
