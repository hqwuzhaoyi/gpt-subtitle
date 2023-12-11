import { useProxyUrlAtom, useSetProxyUrlAtom } from "@/atoms/proxyUrl";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const initialSetupSchema = z.object({
  localProxyUrl: z
    .string()
    .startsWith("http", { message: "Must provide correct URL" }),
});

export type InitialSetupValues = z.infer<typeof initialSetupSchema>;

export const useSeverSetting = () => {
  const localProxyUrl = useProxyUrlAtom();
  const setLocalProxyUrl = useSetProxyUrlAtom();

  const form = useForm<InitialSetupValues>({
    resolver: zodResolver(initialSetupSchema),
    defaultValues: { localProxyUrl },
    mode: "onChange",
  });

  const onSubmit = (data: InitialSetupValues) => {
    setLocalProxyUrl(data.localProxyUrl);
  };

  return { form, onSubmit };
};
