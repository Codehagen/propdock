"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel
} from "@propdock/ui/components//form";
import { Switch } from "@propdock/ui/components//switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function SelectInputForm({ options, image }) {
  const router = useRouter();
  const [activeSwitch, setActiveSwitch] = useState(null);

  const dynamicSchema = options.reduce((acc, option) => {
    acc[option.key] = z.boolean();
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(z.object(dynamicSchema))
  });

  const handleSwitchChange = async option => {
    setActiveSwitch(option.label);

    // Get the content of the selected option
    const selectedOptionContent = option.description;

    // Call the server action to update the selected option in the database
    try {
      // If an error occurs, log it and display a toast notification
      toast.error("Failed to update the selected option. Please try again.");
      router.refresh();
      console.log("Selected option updated successfully");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-5 grid gap-2">
        {image.selectedOption ? (
          <div className="flex items-center">
            <Card>
              <CardHeader className="relative">
                <span
                  onClick={() =>
                    handleSwitchChange({ imageId: image.id, description: null })
                  }
                  className="absolute top-3 right-3 hover:cursor-pointer"
                >
                  <X size="16" />
                </span>
                <CardDescription>Selected Option:</CardDescription>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {
                  (image.selectedOption = image.selectedOption.replace(
                    /^\d+\.\s*/,
                    ""
                  ))
                }
              </CardContent>
            </Card>
          </div>
        ) : null}
        {options.every(option => !option.selectedOption) && (
          <>
            {options.map(option => (
              <FormField
                key={option.key}
                control={form.control}
                name={option.label}
                render={({ field }) => (
                  <div
                    onClick={() => {
                      handleSwitchChange(option);
                    }}
                    className="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {option.label}
                      </FormLabel>
                      <FormDescription>{option.description}</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="mx-2"
                        id={`${option.key}-switch`}
                        type="submit"
                        checked={activeSwitch === option.label}
                        onClick={() => {
                          handleSwitchChange(option);
                        }}
                        {...field}
                      />
                    </FormControl>
                  </div>
                )}
              />
            ))}
          </>
        )}
      </form>
    </Form>
  );
}
