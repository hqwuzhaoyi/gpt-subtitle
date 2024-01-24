"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Preferences } from "./components/prefrences";
import { Models } from "./components/models";

export default function WhisperSetting() {
  return (
    <Tabs defaultValue="preferences">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">Whisper</h1>
        <TabsList className="ml-auto">
          <TabsTrigger
            value="preferences"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Models
          </TabsTrigger>
        </TabsList>
      </div>
      <Separator />

      <TabsContent value="preferences" className="m-0">
        <Preferences />
      </TabsContent>
      <TabsContent value="models" className="m-0">
        <Models />
      </TabsContent>
    </Tabs>
  );
}
