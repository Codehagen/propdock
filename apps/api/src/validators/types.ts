interface User {
  id: number
  email: string
  workspaceId: string | null
  apiKey: string
}

interface Property {
  id: string
  name: string
  type: string
  workspaceId: string
}

interface Building {
  id: string
  propertyId: string
  // Add other relevant fields based on your application's needs
}

interface Env {
  // Add environment-specific properties here
}

interface CustomContext {
  user?: User
  test?: boolean
}
