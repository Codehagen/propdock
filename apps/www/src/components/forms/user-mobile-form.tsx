"use client";

import { updateUserMobile } from "@/actions/update-user-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { buttonVariants } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import { Input } from "@propdock/ui/components/input";
import { Label } from "@propdock/ui/components/label";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { userMobileSchema } from "@/lib/validations/user";

interface UserMobileFormProps {
  user: Pick<User, "id" | "phone">;
}

interface FormData {
  phone: string;
}

export function UserMobileForm({ user }: UserMobileFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateUserMobileWithId = updateUserMobile.bind(null, user.id);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userMobileSchema),
    defaultValues: {
      phone: user.phone || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserMobileWithId(data);

      if (status !== "success") {
        toast.error(
          "Ditt mobilnummer ble ikke oppdatert. Vennligst prøv igjen",
        );
      } else {
        toast.success("Mobil nummeret ditt har blitt oppdatert");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Mobilnummer</CardTitle>
          <CardDescription>Skriv inn ditt telefonnummer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="phone">
              Mobilnummer
            </Label>
            <Input
              id="phone"
              className="w-[400px]"
              size={32}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="px-1 text-red-600 text-xs">
                {errors.phone.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{isPending ? "Lagrer..." : "Lagre"}</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
