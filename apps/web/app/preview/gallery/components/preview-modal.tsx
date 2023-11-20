import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { ChevronDownCircle } from "lucide-react";
import Image from "next/image";
import { Album } from "../data/schema";
import { FinishedCircle } from "./finished-circle";

function ShowCard({ album }: { album: Album }) {
  return (
    <div>
      <div className="h-64 w-full relative">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title ?? ""}
            className="object-cover h-full w-full rounded-md "
          />
        ) : (
          <div className=" bg-gray-200"></div>
        )}
      </div>

      <div className="p-6 ">
        <h3 className="text-lg leading-6 font-medium ">{album.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{album.originaltitle}</p>
        {/* 播放按钮等控件 */}
        <div className="flex  mt-4">
          <Button type="button">播放</Button>
          {album.path && (
           <FinishedCircle className="ml-[0.5em] w-[32px] h-[32px]" />
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

export function PreviewModal({ album }: { album: Album }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ChevronDownCircle className="opacity-80 rounded-full shadow-md text-gray-400" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0">
        <ShowCard album={album} />
        <div className="grid gap-4">
          {/* <div className="rounded-md bg-black p-6">
            <pre>
              <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-4">
                <span>
                  <span className="text-sky-300">import</span> os
                </span>
                <span>
                  <span className="text-sky-300">import</span> openai
                </span>
                <span />
                <span>
                  openai.api_key = os.getenv(
                  <span className="text-green-300">
                    &quot;OPENAI_API_KEY&quot;
                  </span>
                  )
                </span>
                <span />
                <span>response = openai.Completion.create(</span>
                <span>
                  {" "}
                  model=
                  <span className="text-green-300">&quot;davinci&quot;</span>,
                </span>
                <span>
                  {" "}
                  prompt=<span className="text-amber-300">&quot;&quot;</span>,
                </span>
                <span>
                  {" "}
                  temperature=<span className="text-amber-300">0.9</span>,
                </span>
                <span>
                  {" "}
                  max_tokens=<span className="text-amber-300">5</span>,
                </span>
                <span>
                  {" "}
                  top_p=<span className="text-amber-300">1</span>,
                </span>
                <span>
                  {" "}
                  frequency_penalty=<span className="text-amber-300">0</span>,
                </span>
                <span>
                  {" "}
                  presence_penalty=<span className="text-green-300">0</span>,
                </span>
                <span>)</span>
              </code>
            </pre>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Your API Key can be found here. You should use environment
              variables or a secret management tool to expose your key to your
              applications.
            </p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
