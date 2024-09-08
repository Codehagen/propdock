import type { User } from "@prisma/client";

type CustomContext = {
  user?: User;
  test?: boolean;
  sdk?: unknown;
};

export type { CustomContext };
