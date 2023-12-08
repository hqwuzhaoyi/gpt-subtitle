// 在一个单独的文件中，例如 atoms.js
import { useLocalStorageState } from "ahooks";
import { atom, useAtomValue, useSetAtom } from "jotai";

import { jotaiStore } from "lib/store";

const PROXY_URL_KEY = "proxyUrl";

export const useLocalProxyUrl = () => {
  const [localProxyUrl, setLocalProxyUrl] = useLocalStorageState<string>(
    PROXY_URL_KEY,
    {
      defaultValue: "http://localhost:3001",
    }
  );
  return {
    localProxyUrl,
    setLocalProxyUrl,
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
  const { localProxyUrl } = useLocalProxyUrl();
  return useAtomValue(proxyUrlAtom) || localProxyUrl;
};
