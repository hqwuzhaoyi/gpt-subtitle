// app/providers.tsx
"use client";

import { JotaiStoreProvider } from "./jotai-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiStoreProvider key="jotaiStoreProvider">{children}</JotaiStoreProvider>
  );
}
