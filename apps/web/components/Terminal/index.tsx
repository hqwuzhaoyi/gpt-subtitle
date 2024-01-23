"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useProxyUrlAtom } from "@/atoms/proxyUrl";

interface TerminalProps {
  jobId: string;
}

export function Terminal({ jobId }: TerminalProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const proxyUrl = useProxyUrlAtom();

  useEffect(() => {
    const eventSource = new EventSource(
      proxyUrl + "/osrt/stream?jobId=" + jobId
    ); // 创建一个新的EventSource实例，指向后端的SSE流

    eventSource.onmessage = ({ data }) => {
      const parsedData = JSON.parse(data);
      setMessages((prevMessages) => [...prevMessages, parsedData.data.msg]); // 将新消息添加到现有消息数组中
    };
    return () => {
      eventSource.close();
    };
  }, [jobId]);

  useEffect(() => {
    if (scrollContainerRef.current && refresh) {
      const element = scrollContainerRef.current;
      element.scrollTop = element.scrollHeight; // 在每次messages更新后，将滚动条设置到底部
    }
  }, [messages, refresh]);

  return (
    <aside className="bg-black text-white p-6 rounded-lg w-full   font-mono">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 text-red-500">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2">
            <Switch checked={refresh} onCheckedChange={setRefresh} />
            <Label htmlFor="airplane-mode">refresh</Label>
          </div>

          {/* <p className="text-sm">bash</p> */}
        </div>
      </div>
      {/* <ScrollArea className="h-72  rounded-md leading-normal"> */}
      {/* <div ref={scrollContainerRef}> */}
      <div
        className={clsx("mt-4 h-[18rem] overflow-auto", styles["scrollbar"])}
        ref={scrollContainerRef}
      >
        {messages.map((message, index) => (
          <p
            key={index}
            className={clsx("text-white", styles["animate-fade-in"])}
          >
            {message}
          </p> // 渲染每个从后端推送过来的消息
        ))}
        {/* </div> */}
      </div>
      {/* // </ScrollArea> */}
    </aside>
  );
}
