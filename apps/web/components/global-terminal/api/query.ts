import { customGet } from "@/lib/clientFetch";

export type Job = {
  id: string;
  name: string;
};

export const getCurrentJobs = async () => {
  try {
    const response = await customGet<Job[]>(`/osrt/currentJobs`, {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data");
  }
};
