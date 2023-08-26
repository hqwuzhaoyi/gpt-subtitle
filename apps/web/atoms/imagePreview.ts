import { atom, useAtomValue } from "jotai";

import { jotaiStore } from "lib/store";

type ImagePreviewType = {
  visible: boolean;
  image?: {
    src: string;
    title: string;
  } | null;
};

export const imagePreviewAtom = atom({
  visible: false,
  image: null,
} as ImagePreviewType);

export const useImagePreview = () => {
  return useAtomValue(imagePreviewAtom);
};

export const setImagePreviewVisible = (visible: boolean) =>
  jotaiStore.set(imagePreviewAtom, (prev: any) => ({ ...prev, visible }));

export const setImagePreviewImage = (image: ImagePreviewType["image"]) =>
  jotaiStore.set(imagePreviewAtom, (prev: any) => ({ ...prev, image }));
export const setImagePreview = (state: ImagePreviewType) => {
  jotaiStore.set(imagePreviewAtom, (prev: any) => ({ ...prev, ...state }));
};
