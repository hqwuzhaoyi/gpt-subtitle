import { atom, useAtom, useAtomValue } from "jotai";

import { jotaiStore } from "lib/store";

export type SearchKeyType = string;

const searchKey = atom("" as SearchKeyType);

export const useSearchKey = () => {
  return useAtomValue(searchKey);
};

export const setSearchKey = (value: SearchKeyType) => {
  jotaiStore.set(searchKey, value);
};
