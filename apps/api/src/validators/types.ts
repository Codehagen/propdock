interface User {
  id: number;
  email: string;
  workspaceId: string | null;
  apiKey: string;
}

interface Property {
  id: string;
  name: string;
  type: string;
  workspaceId: string;
}

interface Building {
  id: string;
  propertyId: string;
  // Add other relevant fields based on your application's needs
}

type Env = {};

interface CustomContext {
  user?: User;
  test?: boolean;
}
