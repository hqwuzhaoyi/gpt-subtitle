/* eslint-disable @next/next/no-img-element */
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Ban, ChevronDownCircle, Download } from "lucide-react";
import Image from "next/image";
import { Album } from "../data/schema";
import { FinishedCircle } from "./finished-circle";
import { outPutSrtStop } from "../../tasks/api/osrt";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { Terminal } from "@/components/Terminal";

function ShowCard({
  album,
  handleStart,
}: {
  album: Album;
  handleStart: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className="h-64 w-full relative">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title ?? ""}
            className="object-cover h-full w-full shandow-md rounded-md "
          />
        ) : (
          <div className=" bg-gray-200"></div>
        )}
      </div>

      <div className="p-6 ">
        <div className="flex gap-6">
          {album.poster && album.fanart && (
            <img
              src={album.poster}
              alt={album.title ?? ""}
              className="object-cover h-[330px] w-[250px] rounded-md "
            />
          )}
          <div>
            <h3 className="text-lg leading-6 font-medium ">{album.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{album.originaltitle}</p>
            {/* 播放按钮等控件 */}
            <div className="flex items-center  mt-4">
              <Button type="button" onClick={handleStart}>
                {album.path ? "Restart" : "Start"}
              </Button>
              {album.path && (
                <FinishedCircle className="ml-[0.5em] w-[32px] h-[32px]" />
              )}
              {album.processingJobId && (
                <Ban
                  onClick={async () => {
                    await outPutSrtStop(album.processingJobId);
                    toast({
                      title: "Stop all jobs success.",
                      description: "All tasks have been cleared.",
                    });
                  }}
                  className="ml-[0.5em] w-[32px] h-[32px]"
                >
                  Stop
                </Ban>
              )}
              {/* {album.processingJobId && (
            <HoverCard>
              <HoverCardTrigger>
                <TerminalSquare className=" opacity-80 rounded-full shadow-md text-gray-400"></TerminalSquare>
              </HoverCardTrigger>
              <HoverCardContent className="w-[36rem] p-0 border-none bg-transparent">
                <Terminal jobId={album.processingJobId}></Terminal>
              </HoverCardContent>
            </HoverCard>
          )} */}
            </div>
            <p className="text-sm text-gray-500 mt-4">{album.plot}</p>

            <div className="text-left mt-6">
              <p>
                <strong>Date Added: </strong>
                {album.dateadded}
              </p>
              {/* <p>
            <strong>评级：</strong>
            {album.rating}
          </p> */}
              {/* 其他信息... */}
            </div>

            {/* 演员信息 */}
            {album.actors && (
              <div className="text-left mt-6">
                <p>
                  <strong>Actor: </strong>
                </p>
                <div className="flex flex-wrap">
                  {album.actors?.map((actor, index) => (
                    <div
                      key={index}
                      className="m-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                    >
                      {actor.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const video = {
  id: 1,
  title: "视频标题",
  description: "这里是视频描述...",
  image: "path/to/image.jpg",
  releaseDate: "2023-01-01",
  rating: "PG-13",
  actors: ["演员1", "演员2", "演员3"],
  // ...其他数据
};

export function PreviewModal({
  album,
  handleStart,
}: {
  album: Album;
  handleStart: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ChevronDownCircle className="opacity-80 rounded-full shadow-md text-gray-400" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0 max-h-[80vh] overflow-auto">
        <ShowCard album={album} handleStart={handleStart} />
        {album.processingJobId && (
          <div className="grid gap-4 p-4">
            <Terminal jobId={album.processingJobId}></Terminal>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
