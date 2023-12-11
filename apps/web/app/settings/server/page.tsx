"use client";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InitialSetupValues, useSeverSetting } from "@/hooks/useSeverSetting";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsProfilePage() {
  const { form, onSubmit } = useSeverSetting();
  const { toast } = useToast();

  const handleSubmit = (data: InitialSetupValues) => {
    onSubmit(data);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Server address</h3>
        <p className="text-sm text-muted-foreground">
          This is your http server address.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
