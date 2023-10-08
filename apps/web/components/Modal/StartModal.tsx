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
import { outPutSrt } from "app/preview/tasks/api/osrt";
import { useWhisperModel } from "@/atoms/whisperModel";

export const StartModal = ({
  id,
  open,
  onOpenChange,
  continueCallback,
}: {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  continueCallback?: (id: string) => void;
}) => {
  const [language, setLanguage] = React.useState<LanguageEnum>(
    LanguageEnum.Auto
  );
  const { model } = useWhisperModel();
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
                <ModelSelect />
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
              await outPutSrt(language, id, model);
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
