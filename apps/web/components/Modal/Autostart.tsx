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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "../language-select";
import { ModelSelect } from "@/components/ModelSelect";
import { LanguageEnum } from "shared-types";
import { autoStart } from "locale/preview/tasks/api/osrt";
import { useWhisperModel } from "@/atoms/whisperModel";
import { toast } from "../ui/use-toast";
import { useTranslations } from "next-intl";

export const AutoStartModal = () => {
  const [language, setLanguage] = React.useState<LanguageEnum>(
    LanguageEnum.Auto
  );
  const { model } = useWhisperModel();
  const t = useTranslations("Whisper");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 bg-primary text-primary-foreground"
        >
          {t("Automatic Startup")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("Settings for automatic startup")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">{t("Language")}</Label>
                <LanguageSelect value={language} onChange={setLanguage} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">{t("Model")}</Label>
                <ModelSelect />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel> {t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!model) {
                toast({
                  title: "Please select model",
                });
                return;
              }
              autoStart(language, model);
            }}
          >
            {t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
