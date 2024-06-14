import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import { Button } from "@dingify/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu";
import { Separator } from "@dingify/ui/components/separator";

export function ChannelCard2({ channelDetails }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {channelDetails.events.map((event) => (
        <Card key={event.id}>
          <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>
                Created At: {new Date(event.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
              <Button variant="secondary" className="px-3 shadow-none">
                <StarIcon className="mr-2 h-4 w-4" />
                Star
              </Button>
              <Separator orientation="vertical" className="h-[20px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-2 shadow-none">
                    <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-5}
                  className="w-[200px]"
                  forceMount
                >
                  <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Future Ideas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Inspiration
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" /> Create List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                TypeScript
              </div>
              <div className="flex items-center">
                <StarIcon className="mr-1 h-3 w-3" />
                20k
              </div>
              <div>Updated April 2023</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
