import { Prisma } from "@prisma/client";
import type { User } from "@prisma/client";

/**
 * Extends Prisma with a filter on all queries such that the result will return only
 * instances belonging to the same workspace as the user.
 *
 * Requires `user` to have a workspace, and the query must target a model that has
 * `workspaceId` in its schema. The query must additionally not have `workspaceId`
 * in its `where`-clause already.
 */
function workspaceExtension(user: User) {
  const workspaceId = user.workspaceId!;
  const ext = Prisma.defineExtension({
    query: {
      $allOperations({ model, operation, args, query }) {
        args.where = { ...args.where, workspaceId: workspaceId };
        return query(args);
      }
    }
  });

  return ext;
}

export { workspaceExtension };
