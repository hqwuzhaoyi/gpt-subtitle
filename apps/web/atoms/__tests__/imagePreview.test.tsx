import { renderHook, act } from "@testing-library/react-hooks";
import {
  useImagePreview,
  setImagePreviewVisible,
  setImagePreviewImage,
  setImagePreview,
  imagePreviewAtom,
} from "../imagePreview";
import { jotaiStore } from "lib/store"; // 假设这样引入
import { Provider } from "jotai";

const wrapper = ({ children }: { children: any }) => (
  <Provider store={jotaiStore}>{children}</Provider>
);

describe("Image Preview Hooks and Actions", () => {
  it("should set form name from server", () => {
    expect(imagePreviewAtom).toBeDefined();
  });

  it("should use initial state", () => {
    const { result } = renderHook(() => useImagePreview(), { wrapper });
    expect(result.current).toEqual({
      visible: false,
      image: null,
    });
  });

  it("should set image preview visibility", () => {
    const { result } = renderHook(() => useImagePreview(), { wrapper });
    act(() => {
      setImagePreviewVisible(true);
    });
    expect(result.current.visible).toEqual(true);
  });

  it("should set image preview image", () => {
    const { result } = renderHook(() => useImagePreview(), { wrapper });
    const newImage = { src: "src", title: "title" };
    act(() => {
      setImagePreviewImage(newImage);
    });

    expect(result.current.image).toEqual(newImage);
  });

  it("should set image preview state", () => {
    const { result } = renderHook(() => useImagePreview(), { wrapper });
    const newState = { visible: true, image: { src: "src", title: "title" } };
    act(() => {
      setImagePreview(newState);
    });

    console.debug(result.current);
    expect(result.current).toEqual(newState);
  });
});
