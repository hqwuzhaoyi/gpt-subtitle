// __tests__/whisperModel.test.js
import { act, renderHook } from "@testing-library/react-hooks";
import { Provider } from "jotai";

import { setWhisperModel, useWhisperModel } from "../whisperModel";
import { jotaiStore } from "lib/store";

describe("setWhisperModel", () => {
  it("should use initial state", () => {
    const { result } = renderHook(() => useWhisperModel(), {
      wrapper: ({ children }: { children: any }) => (
        <Provider store={jotaiStore}>{children}</Provider>
      ),
    });

    expect(result.current).toEqual({
      model: undefined,
      type: undefined,
    });
  });

  it("should set the model correctly", () => {
    const newModel = "New Model";

    const { result } = renderHook(() => useWhisperModel(), {
      wrapper: ({ children }: { children: any }) => (
        <Provider store={jotaiStore}>{children}</Provider>
      ),
    });

    act(() => {
      setWhisperModel(newModel);
    });

    expect(result.current.model).toEqual(newModel);
  });
});
