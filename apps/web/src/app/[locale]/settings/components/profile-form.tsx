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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

import { Slider } from "@/components/ui/slider";

import { ProfileFormValues, profileFormSchema } from "../data/schema";
import { TranslateLanguage, TranslateType } from "shared-types";
import { setProfile } from "../api/client";
import { useTranslations } from "next-intl";

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: Partial<ProfileFormValues>;
}) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const t = useTranslations("Settings.Profile");
  const tSettings = useTranslations("Settings");

  const { refresh } = useRouter();

  async function onSubmit(data: ProfileFormValues) {
    setProfile(data);

    toast({
      title: tSettings("updated"),
      description: tSettings("updatedDescription"),
    });
    refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">{t("systemSettings")}</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="OUTPUT_SRT_THEN_TRANSLATE"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Output Srt Then Translate")}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        "Do you need translation after outputting the srt file"
                      )}
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
              name="TranslateModel"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Translate Model")}
                    </FormLabel>
                    <FormDescription>
                      {t("Choose the translation model you need")}
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TranslateType).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LANGUAGE"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Translate Language")}
                    </FormLabel>
                    <FormDescription>
                      {t("Choose the translation language you need")}
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TranslateLanguage).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TRANSLATE_GROUP"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Translate Group")}
                    </FormLabel>
                    <FormDescription>
                      {t("Number of dialogue lines translated at once")}
                    </FormDescription>
                  </div>
                  <Slider
                    defaultValue={[field.value ?? 4]}
                    max={10}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  {
                    <div className="flex justify-between">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="TRANSLATE_DELAY"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("Translate Delay")}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        "The interval between translation interfaces, in milliseconds"
                      )}
                    </FormDescription>
                  </div>
                  <Slider
                    defaultValue={[field.value ?? 1500]}
                    max={5000}
                    step={100}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  {
                    <div className="flex justify-between">
                      <span>0</span>
                      <span>5000</span>
                    </div>
                  }
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">{t("Update profile")}</Button>
      </form>
    </Form>
  );
}
