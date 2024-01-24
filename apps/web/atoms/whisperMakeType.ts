import { atom, useAtom, useAtomValue } from "jotai";

import { jotaiStore } from "lib/store";
import { MakeType } from "shared-types";
import { atomWithStorage } from "jotai/utils";

type WhisperMakeType = {
  value: MakeType;
};

export const whisperMakeAtom = atomWithStorage("whisperMakeType", {
  value: MakeType.Metal,
} as WhisperMakeType);

export const useWhisperMake = () => {
  return useAtom(whisperMakeAtom);
};

export const setWhisperMake = (value: MakeType) =>
  jotaiStore.set(whisperMakeAtom, (prev: any) => ({ ...prev, value }));
