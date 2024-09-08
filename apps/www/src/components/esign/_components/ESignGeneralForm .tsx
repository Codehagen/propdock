"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import { Progress } from "@propdock/ui/components/progress";
import { Textarea } from "@propdock/ui/components/textarea";
import { Pencil, SendIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Tittel er påkrevd" }),
  description: z.string().optional(),
  signers: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Navn er påkrevd" }),
        mobile: z.string().min(8, { message: "Gyldig mobilnummer er påkrevd" }),
        email: z.string().email({ message: "Ugyldig e-postadresse" })
      })
    )
    .min(1, { message: "Minst én signerer er påkrevd" })
  // Legg til flere felter etter behov
});

const TOTAL_STEPS = 3;

const stepContent = {
  1: {
    title: "Generelt",
    description: "Konfigurer generelle innstillinger for dokumentet."
  },
  2: {
    title: "Legg til signerere",
    description: "Legg til personene som skal signere dokumentet."
  },
  3: {
    title: "Gjennomgang",
    description: "Gjennomgå og bekreft all informasjon før innsending."
  }
};

export function ESignGeneralForm({
  onFormSubmit
}: {
  onFormSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      signers: [{ name: "", mobile: "", email: "" }]
    },
    mode: "onChange"
  });

  const { fields, append, remove } = useFieldArray({
    name: "signers",
    control: form.control
  });

  // Funksjon for å legge til deg selv som signerer
  function addMyself() {
    // Du ville vanligvis hente denne informasjonen fra en bruker-kontekst eller tilstand
    const myEmail = "christer.hagen@dingify.com";
    const myName = "Christer Hagen";
    const myMobile = "98453571"; // Add your default mobile number here
    append({ name: myName, mobile: myMobile, email: myEmail });
  }

  async function onContinue() {
    const fields = step === 1 ? ["title"] : step === 2 ? ["signers"] : [];
    const isStepValid = await form.trigger(fields as any);
    if (isStepValid) {
      setStep(Math.min(TOTAL_STEPS, step + 1));
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit(values); // Pass the form data to the parent component
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg leading-none tracking-tight">
            {stepContent[step].title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {stepContent[step].description}
          </p>
        </div>

        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tittel <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Skriv inn dokumenttittel..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivelse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Skriv inn valgfri beskrivelse..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Dette feltet er valgfritt</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-end space-x-2">
                  <FormField
                    control={form.control}
                    name={`signers.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Navn</FormLabel>
                        <FormControl>
                          <Input placeholder="Skriv inn navn..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`signers.${index}.mobile`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Mobilnummer</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Skriv inn mobilnummer..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <FormField
                    control={form.control}
                    name={`signers.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input placeholder="Skriv inn e-post..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={index === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", mobile: "", email: "" })}
                className="flex-grow"
              >
                + Legg til
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={addMyself}
                className="w-1/3"
              >
                + Legg til meg
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Dokumentdetaljer</h4>
              <p>
                <strong>Tittel:</strong> {form.getValues("title")}
              </p>
              <p>
                <strong>Beskrivelse:</strong>{" "}
                {form.getValues("description") || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Signerere</h4>
              {form.getValues("signers").map((signer, index) => (
                <div key={index}>
                  <p>
                    <strong>Signer {index + 1}:</strong> {signer.name} (
                    {signer.email})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-muted-foreground text-sm">
            Steg {step} av {TOTAL_STEPS}
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="w-full" />
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Gå tilbake
          </Button>
          {step < TOTAL_STEPS ? (
            <Button type="button" onClick={onContinue}>
              Fortsett
            </Button>
          ) : (
            <Button type="submit">
              <SendIcon className="mr-2 h-4 w-4" />
              Send inn
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
