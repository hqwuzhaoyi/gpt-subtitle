"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { WhisperSchema, WhisperValues } from "../data/schema";
import { useModels } from "@/hooks/useModels";
import { Loader2 } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { downloadWhisper, getWhisper, updateWhisper } from "../api/client";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { LanguageEnum } from "shared-types";

export default function WhisperForm() {
  const { data, isLoading } = useSWR("/api/whisper", getWhisper);

  const defaultValue = useMemo(() => {
    if (isLoading || !data) {
      return null;
    } else {
      if (data.threads) data.threads = Number(data.threads);
      if (data.maxContent) data.maxContent = Number(data.maxContent);
      if (data.entropyThold) data.entropyThold = Number(data.entropyThold);
      if (!data.videoLanguage) data.videoLanguage = LanguageEnum.Auto;
      if (!data.model) data.model = "";
      return WhisperSchema.parse(data);
    }
  }, [data, isLoading]);

  if (isLoading || !defaultValue) {
    return null;
  } else {
    return <ProfileForm defaultValues={defaultValue} />;
  }
}

function ProfileForm({ defaultValues }: { defaultValues: WhisperValues }) {
  const form = useForm<WhisperValues>({
    resolver: zodResolver(WhisperSchema),
    defaultValues,
    mode: "onChange",
  });
  const { refresh } = useRouter();

  async function onSubmit(data: WhisperValues) {
    updateWhisper(data);

    toast({
      title: "Update Success",
      description: "Your profile has been updated.",
    });
    refresh();
  }

  const [downloadLoading, setDownloadLoading] = useState(false);

  async function onDownload() {
    try {
      setDownloadLoading(true);
      await downloadWhisper();

      toast({
        title: "Download Success",
        description: "Whisper service has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Whisper service download failed.",
      });
    }
    setDownloadLoading(false);
  }

  const { data: models = [], isLoading: modelsLoading } = useModels();

  return (
    <Form {...form}>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h3 className="mb-4 text-lg font-medium">Models Management</h3>
          <Button onClick={() => onDownload()}>
            {downloadLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Download
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">Global Whisper Settings</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Whisper Model</FormLabel>
                    <FormDescription>
                      Choose the whisper model you need
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        {modelsLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue placeholder="Select a whisper model to use" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem value={model} key={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoLanguage"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Audio Language</FormLabel>
                    <FormDescription>
                      Choose the audio language you need
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <LanguageSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Prompt</FormLabel>
                    <FormDescription>Set the entropy threshold</FormDescription>
                    <FormMessage />
                  </div>
                  <Textarea value={field.value} onChange={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="threads"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Threads</FormLabel>
                    <FormDescription>Set threads</FormDescription>
                    <FormMessage />
                  </div>
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxContent"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Max Content</FormLabel>
                    <FormDescription>
                      Set the max content length
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entropyThold"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Entropy Threshold
                    </FormLabel>
                    <FormDescription>Set the entropy threshold</FormDescription>
                    <FormMessage />
                  </div>
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
