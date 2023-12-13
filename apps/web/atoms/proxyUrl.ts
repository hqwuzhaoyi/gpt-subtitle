// 在一个单独的文件中，例如 atoms.js
import { useCookieState, useLocalStorageState, useMount } from "ahooks";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { jotaiStore } from "lib/store";
import { useRef } from "react";

const PROXY_URL_KEY = "proxyUrl";
const PROXY_URL_HAS_BEEN_SET_KEY = "proxyUrlHasBeenSet";

export const useLocalProxyUrl = () => {
  const [local, setLocal] = useLocalStorageState<string>(PROXY_URL_KEY, {
    defaultValue: "http://localhost:3001",
    serializer: (v) => v ?? "",
    deserializer: (v) => v,
  });
  const [proxyUrlHasBeenSet, setProxyUrlHasBeenSet] = useCookieState(
    PROXY_URL_HAS_BEEN_SET_KEY
  );
  const [cookieState, setCookieState] = useCookieState(PROXY_URL_KEY, {
    defaultValue: "http://localhost:3001",
  });

  return {
    localProxyUrl: local || cookieState,
    setLocalProxyUrl: (proxyUrl: string) => {
      setLocal(proxyUrl);
      setCookieState(proxyUrl);
      setProxyUrlHasBeenSet("true");
    },
  };
};

export const proxyUrlAtom = atom("http://localhost:3001");

export const setProxyUrlAtom = (proxyUrl: string) => {
  localStorage.setItem(PROXY_URL_KEY, proxyUrl);
  jotaiStore.set(proxyUrlAtom, proxyUrl);
};

export const useSetProxyUrlAtom = () => {
  const { setLocalProxyUrl } = useLocalProxyUrl();
  const setProxyUrl = useSetAtom(proxyUrlAtom);
  return (proxyUrl: string) => {
    setLocalProxyUrl(proxyUrl);
    setProxyUrl(proxyUrl);
  };
};

export const useProxyUrlAtom = () => {
  const ref = useRef(false);
  if (!ref.current) {
    const proxyUrl = typeof window !== "undefined" ? window.localStorage.getItem(PROXY_URL_KEY) : undefined;
    if (proxyUrl) {
      jotaiStore.set(proxyUrlAtom, proxyUrl);
    }
    ref.current = true;
  }

  const proxyUrl = useAtomValue(proxyUrlAtom);

  const { localProxyUrl } = useLocalProxyUrl();
  return proxyUrl || localProxyUrl;
};
