import React from "react";
import { downloadModel, downloadWhisper } from "../../api/client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MakeType, WhisperModel, WhisperModelDescription } from "shared-types";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setWhisperMake, useWhisperMake } from "@/atoms/whisperMakeType";
import { ModelItem } from "./model-item";
import { useModels } from "@/hooks/useModels";
import { useTranslations } from "next-intl";

export const Models = () => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const t = useTranslations("Settings.Whisper");

  async function onDownload() {
    try {
      setDownloadLoading(true);
      await downloadWhisper({
        force: true,
        makeType: whisperMakeValue.value,
      });

      toast({
        title: t("DownloadSuccess"),
        description: t("DownloadSuccessDesc"),
      });
    } catch (error) {
      toast({
        title: t("DownloadFailed"),
        description: t("DownloadFailedDesc"),
      });
    }
    setDownloadLoading(false);
  }

  const [whisperMakeValue, setWhisperMakeValue] = useWhisperMake();

  const { data: models = [], isLoading: modelsLoading } = useModels();

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-medium">{t("ModelsManagement")}</h3>
          <div className="flex items-center gap-2">
            <Select
              value={whisperMakeValue.value as string}
              onValueChange={(e) => {
                setWhisperMakeValue({
                  value: e as MakeType,
                });
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MakeType).map(([label, value]) => (
                  <SelectItem value={value} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => onDownload()} variant="outline">
              {downloadLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("ReDownload")}
            </Button>
          </div>
        </div>
        <ScrollArea className="h-screen">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {Object.entries(WhisperModel).map(([title, value]) => (
              <ModelItem
                title={title}
                value={value}
                key={value}
                isFinished={
                  models.find((model) => model === `ggml-${value}.bin`) !==
                  undefined
                }
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
