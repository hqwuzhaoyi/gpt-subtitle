"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { InitialSetupValues, useSeverSetting } from "@/hooks/useSeverSetting";

export default function Component() {
  const { replace } = useRouter();

  const { form, onSubmit } = useSeverSetting();

  const handleSubmit = (data: InitialSetupValues) => {
    onSubmit(data);
    replace("/");
  };

  return (
    <div className="container relative hidden h-[600px] flex-col items-center justify-center md:grid lg:max-w-none  lg:px-0">
      <Card>
        <CardHeader>
          <CardTitle>Initial Setup</CardTitle>
          <CardDescription>
            Please fill in the following information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="localProxyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server address</FormLabel>
                      <FormControl>
                        <Input placeholder="http://localhost:3001" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your http server address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center pt-4">
                <Button type="submit" className="w-full">
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
