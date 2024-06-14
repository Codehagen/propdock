import type { User } from "@prisma/client";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "@/components/shared/icons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@dingify/ui/components/avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage
          alt="Picture"
          src={user.image}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
