import { atom, useAtom, useAtomValue } from "jotai";

import { jotaiStore } from "lib/store";

export type ModelType = string;

const whisperModel = atom({
  model: undefined, // ModelType
  type: undefined, // TableType
} as {
  model: ModelType | undefined;
  type: string | undefined;
});

export const useWhisperModel = () => {
  return useAtomValue(whisperModel);
};

export const setWhisperModel = (model: ModelType) => {
  jotaiStore.set(whisperModel, (prev: any) => ({ ...prev, model }));
};
