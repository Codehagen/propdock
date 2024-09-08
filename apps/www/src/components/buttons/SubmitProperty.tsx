import { Button } from "@propdock/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@propdock/ui/components/dialog";
import { Input } from "@propdock/ui/components/input";
import { Label } from "@propdock/ui/components/label";
import Link from "next/link";

export function SubmitProperty() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Submit Property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Do you want to submit your property?</DialogTitle>
          <DialogDescription>
            Lets send this to your provider (Finn.no)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href="/property" passHref>
            <Button type="submit">Save new property</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
