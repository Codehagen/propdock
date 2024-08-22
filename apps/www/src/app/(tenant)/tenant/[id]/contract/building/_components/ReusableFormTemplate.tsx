"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import { Calendar } from "@propdock/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { Checkbox } from "@propdock/ui/components/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import { Label } from "@propdock/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@propdock/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select"
import { Switch } from "@propdock/ui/components/switch"
import { Textarea } from "@propdock/ui/components/textarea"
import { toast } from "@propdock/ui/components/use-toast"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"

// Define the validation schema
const FormSchema = z.object({
  area: z.string().min(1, "Area is required"),
  securityLevel: z.string().min(1, "Security Level is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
  mobile: z.boolean().default(false).optional(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})

export function ReusableFormTemplate() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      area: "",
      securityLevel: "",
      subject: "",
      description: "",
      marketing_emails: false,
      security_emails: true,
      mobile: true,
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Simulate form submission
      const result = await submitForm(data)

      if (!result.success) {
        throw new Error(result.error || "Failed to submit form.")
      }

      toast.success(`Form submitted successfully`)
      form.reset()
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reusable Form Template</CardTitle>
        <CardDescription>
          This form includes various input types for comprehensive data
          collection.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="deployments">
                            Deployments
                          </SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="securityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="line-clamp-1 w-[160px] truncate">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            Severity 1 (Highest)
                          </SelectItem>
                          <SelectItem value="2">Severity 2</SelectItem>
                          <SelectItem value="3">Severity 3</SelectItem>
                          <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="I need help with..." {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please include all information relevant to your issue."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketing_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Marketing emails</FormLabel>
                        <FormDescription>
                          Receive emails about new products, features, and more.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Security emails</FormLabel>
                        <FormDescription>
                          Receive emails about your account security.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Use different settings for my mobile devices
                    </FormLabel>
                    <FormDescription>
                      You can manage your mobile notifications in the{" "}
                      <Link href="/examples/forms">mobile settings</Link> page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button variant="ghost" type="reset">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

// Dummy function to simulate form submission
async function submitForm(data) {
  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}
