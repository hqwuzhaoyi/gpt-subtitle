import React from "react";
import { downloadWhisper } from "../../api/client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WhisperModel, WhisperModelDescription } from "shared-types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

export const Models = () => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  async function onDownload() {
    try {
      setDownloadLoading(true);
      await downloadWhisper({
        force: true,
      });

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

  function onModelDownload(model: WhisperModel) {
    console.log(model);
    toast({
      title: "Download Success",
      description: "Whisper model has been downloaded.",
    });
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-medium">Models Management</h3>
          <Button onClick={() => onDownload()} variant="outline">
            {downloadLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Re-Download
          </Button>
        </div>
        <ScrollArea className="h-screen">
          <div className="flex flex-col gap-2 p-4 pt-0">
            {Object.entries(WhisperModel).map(([title, value]) => (
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
                >
                  <DownloadCloud className="h-4 w-4" />
                </Button>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
