"use client";

import React from "react";
import useSWR from "swr";
import { getCurrentJobs } from "./api/query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Terminal as TerminalIcon } from "lucide-react";
import { Terminal } from "@/components/Terminal";
import { Button } from "@/components/ui/button";

export const GlobalTerminal = () => {
  const { data, isLoading } = useSWR("/osrt/currentJobs", getCurrentJobs, {
    refreshInterval: 1000,
  });

  if (isLoading) {
    return null;
  }

  if (data?.length === 0 || !data) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <TerminalIcon className=""></TerminalIcon>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[36rem] p-0 border-none bg-transparent">
        <Terminal jobId={data[0].id}></Terminal>
      </HoverCardContent>
    </HoverCard>
  );
};
