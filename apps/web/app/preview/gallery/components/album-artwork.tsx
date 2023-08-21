"use client";

import Image from "next/image";
import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Album } from "../data/albums";
import { playlists } from "../data/playlists";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  outPutSrt,
  outPutSrtStop,
  terminateAllJobs,
} from "../../tasks/api/osrt";
import { StartModal } from "@/components/Modal/StartModal";
import React from "react";
import { toast } from "@/components/ui/use-toast";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function AlbumArtwork({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            {album.cover && (
              <Image
                src={album.cover}
                alt={album.name}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  "aspect-video"
                )}
              />
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            Start
          </ContextMenuItem>
          {album.processingJobId && (
            <ContextMenuItem
              onClick={async () => {
                await outPutSrtStop(album.processingJobId);
                toast({
                  title: "Stop all jobs success.",
                  description: "All tasks have been cleared.",
                });
              }}
            >
              Stop
            </ContextMenuItem>
          )}
          {album.path && (
            <ContextMenuItem
              onClick={() => {
                window.open(album.path);
              }}
            >
              Download
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <HoverCard openDelay={300}>
          <HoverCardTrigger>
            <h3 className="font-medium leading-none truncate cursor-default">
              {album.name}
            </h3>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm whitespace-break-spaces break-all">
              {album.name}
            </p>
          </HoverCardContent>
        </HoverCard>

        {/* <p className="text-xs text-muted-foreground">{album.artist}</p> */}

        <StartModal id={album.id + ""} open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
