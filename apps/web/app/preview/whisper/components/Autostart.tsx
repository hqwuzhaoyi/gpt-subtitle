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
import { outPutSrtList, autoStart } from "../api/osrt";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "./LanguageSelect";
import { ModelSelect } from "./ModelSelect";
import { LanguageEnum, ModelType } from "../data/types";

export const Autostart = ({ models }: { models: ModelType[] }) => {
  const [language, setLanguage] = React.useState<LanguageEnum>(LanguageEnum.Auto);
  const [model, setModel] = React.useState<ModelType>(models[0]);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 bg-primary text-primary-foreground"
        >
          Automatic Startup
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Settings for automatic startup</AlertDialogTitle>
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
                  onChange={setModel}
                  models={models}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              autoStart(language, model);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
