import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "../LanguageSelect";
import { ModelSelect } from "@/components/ModelSelect";
import { LanguageEnum } from "shared-types";
import { outPutSrt } from "locale/preview/tasks/api/osrt";
import { getWhisper } from "locale/settings/api/client";
import useSWR from "swr";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import PrioritySlider from "../PrioritySlider";
import { WhisperValues } from "locale/settings/data/schema";

type StartModalProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  continueCallback?: (id: string) => void;
};

export const StartModal = (props: StartModalProps) => {
  const { data, isLoading } = useSWR("/api/whisper", getWhisper);

  if (isLoading || !data) {
    return "loading";
  } else {
    return <StartModalContent {...props} defaultValue={data} />;
  }
};

export const StartModalContent = ({
  id,
  open,
  onOpenChange,
  continueCallback,
  defaultValue,
}: StartModalProps & {
  defaultValue: WhisperValues;
}) => {
  const [language, setLanguage] = React.useState<LanguageEnum>(
    defaultValue?.videoLanguage ?? LanguageEnum.Auto
  );
  const [model, setModelValue] = React.useState<string>(
    defaultValue?.model ?? ""
  );
  const [prompt, setPrompt] = React.useState<string>(
    defaultValue?.prompt ?? ""
  );
  const [threads, setThreads] = React.useState<number>(
    defaultValue?.threads ?? 1
  );
  const [maxContent, setMaxContent] = React.useState<number>(
    defaultValue?.maxContent ?? -1
  );
  const [entropyThold, setEntropyThold] = React.useState<number>(
    defaultValue?.entropyThold ?? 2.4
  );
  const [priority, setPriority] = React.useState<number>(1);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Settings for start whisper</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Language</Label>
                <LanguageSelect value={language} onChange={setLanguage} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Model</Label>
                <ModelSelect
                  value={model}
                  onChange={(value) => setModelValue(value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Prompt</Label>
                <Textarea
                  defaultValue={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Threads</Label>
                <Input
                  value={threads}
                  onChange={(e) => setThreads(Number(e.target.value))}
                  type="number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Max Content</Label>
                <Input
                  value={maxContent}
                  onChange={(e) => setMaxContent(Number(e.target.value))}
                  type="number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Entropy Threshold</Label>
                <Input
                  value={entropyThold}
                  onChange={(e) => setEntropyThold(Number(e.target.value))}
                  type="number"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Priority</Label>
                <PrioritySlider
                  className="pt-2"
                  defaultValue={priority}
                  onChange={(value) => setPriority(value)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (!model) {
                alert("Please select a model first");
                return;
              }
              await outPutSrt({
                language,
                id,
                model,
                prompt,
                threads,
                maxContent,
                entropyThold,
              });
              continueCallback && continueCallback(id);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
