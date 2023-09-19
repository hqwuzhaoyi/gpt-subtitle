"use client";

import { useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";

export function Terminal() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/osrt/stream");

    eventSource.onmessage = ({ data }) => {
      const parsedData = JSON.parse(data);
      setMessages((prevMessages) => [...prevMessages, parsedData.msg]); // 将新消息添加到现有消息数组中
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <aside className="bg-black text-white p-6 rounded-lg w-full max-w-lg font-mono">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 text-red-500">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <p className="text-sm">bash</p>
      </div>
      <div className="mt-4">
        {messages.map((message, index) => (
          <p
            key={index}
            className={clsx("text-white", styles["animate-fade-in"])}
          >
            {message}
          </p> // 渲染每个从后端推送过来的消息
        ))}
      </div>
    </aside>
  );
}
