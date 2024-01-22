import React, { useState } from "react";
import { MakeType, WhisperModel, WhisperModelDescription } from "shared-types";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { downloadModel } from "../../api/client";
import { toast } from "@/components/ui/use-toast";
import { useWhisperMake } from "@/atoms/whisperMakeType";
import { cn } from "@/lib/utils";
import { DownloadCloud } from "lucide-react";

const Budges = ({ type }: { type: WhisperModel }) => {
  return WhisperModelDescription[
    type as keyof typeof WhisperModelDescription
  ] ? (
    <div className="flex items-center gap-2">
      {WhisperModelDescription[type as keyof typeof WhisperModelDescription] ? (
        <>
          <Badge variant="secondary">
            Disk:{" "}
            {
              WhisperModelDescription[
                type as keyof typeof WhisperModelDescription
              ].disk
            }
          </Badge>
          <Badge variant="outline">
            Memory:{" "}
            {
              WhisperModelDescription[
                type as keyof typeof WhisperModelDescription
              ].mem
            }
          </Badge>
        </>
      ) : null}
    </div>
  ) : null;
};

export interface ModelItemInterface {
  title: string;
  value: WhisperModel;
}

export const ModelItem = ({ title, value }: ModelItemInterface) => {
  const [whisperMakeValue] = useWhisperMake();

  const [downloadLoading, setDownloadLoading] = useState(false);

  async function onModelDownload(model: WhisperModel) {
    try {
      setDownloadLoading(true);
      await downloadModel({
        model,
        makeType: whisperMakeValue.value,
      });
      setDownloadLoading(false);
      toast({
        title: "Download Success",
        description: "Whisper model has been downloaded.",
      });
    } catch (error) {
      setDownloadLoading(false);
      toast({
        title: "Download Failed",
        description: "Whisper model download failed.",
      });
    }
  }

  return (
    <button
      key={title}
      className={cn(
        "flex justify-between items-center rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
      )}
    >
      <div className="flex flex-col items-start gap-2 ">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{title}</div>
            </div>
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          whisper model description
        </div>
        <Budges type={value} />
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          onModelDownload(value);
        }}
        className="flex items-center justify-center"
      >
        {downloadLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <DownloadCloud className="h-4 w-4" />
        )}
      </Button>
    </button>
  );
};
