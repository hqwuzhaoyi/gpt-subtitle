import React, { use } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between"></div>

      <div>{children}</div>
    </div>
  );
}
