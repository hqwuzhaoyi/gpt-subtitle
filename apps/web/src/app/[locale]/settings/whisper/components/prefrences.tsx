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
import { WhisperSchema, WhisperValues } from "../../data/schema";
import { useModels } from "@/hooks/useModels";
import { Loader2 } from "lucide-react";
import { LanguageSelect } from "@/components/language-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getWhisper, updateWhisper } from "../../api/client";
import useSWR from "swr";
import { useMemo } from "react";
import { LanguageEnum } from "shared-types";
import { useTranslations } from "next-intl";

export function Preferences() {
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

  const t = useTranslations("Settings");
  const tWhisper = useTranslations("Settings.Whisper");

  async function onSubmit(data: WhisperValues) {
    updateWhisper(data);

    await toast({
      title: t("updated"),
      description: t("updatedDescription"),
    });
    refresh();
  }

  const { data: models = [], isLoading: modelsLoading } = useModels();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Whisper {tWhisper("Models")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("ModelsDescription")}
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
                          <SelectValue
                            placeholder={tWhisper("ModelsPlaceholder")}
                          />
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
                    <FormLabel className="text-base">
                      {tWhisper("AudioLanguage")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("AudioLanguageDescription")}
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
                    <FormLabel className="text-base">
                      {tWhisper("Prompt")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("PromptDescription")}
                    </FormDescription>
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
                    <FormLabel className="text-base">
                      {tWhisper("Threads")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("ThreadsDescription")}
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
              name="maxContent"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {tWhisper("MaxContent")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("MaxContentDescription")}
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
                      {tWhisper("EntropyThreshold")}
                    </FormLabel>
                    <FormDescription>
                      {tWhisper("EntropyThresholdDescription")}
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
          </div>
        </div>
        <Button type="submit">{t("Update")}</Button>
      </form>
    </Form>
  );
}
