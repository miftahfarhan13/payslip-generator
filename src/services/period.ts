import { axiosClient } from "./apiClient";

export const periods = async () => {
  return await axiosClient.get("/periods");
};

export const periodById = async ({ id }: { id: string }) => {
  return await axiosClient.get(`/periods/${id}`);
};

export const createPeriod = async ({
  name,
  date,
}: {
  name: string;
  date: string;
}) => {
  return await axiosClient.post("/periods/create", { name, date });
};

export const updatePeriod = async ({
  id,
  name,
  date,
}: {
  id: string;
  name: string;
  date: string;
}) => {
  return await axiosClient.post("/periods/update", { id, name, date });
};
