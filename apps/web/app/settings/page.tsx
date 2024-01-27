"use client";

import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./components/profile-form";
import { getConfig } from "./api/client";
import useSWR from "swr";

export default function SettingsProfilePage() {
  const { data: config, isLoading } = useSWR("settings/profile", getConfig);

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm
        defaultValues={
          config
            ? {
                OUTPUT_SRT_THEN_TRANSLATE:
                  config.OUTPUT_SRT_THEN_TRANSLATE === "1" ? true : false,
                TranslateModel: config.TranslateModel as any,
                TRANSLATE_GROUP: +config.TRANSLATE_GROUP as any,
                TRANSLATE_DELAY: +config.TRANSLATE_DELAY as any,
                LANGUAGE: config.LANGUAGE as any,
              }
            : {}
        }
      />
    </div>
  );
}
