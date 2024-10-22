import { axiosClient } from "./apiClient";

export const employees = async ({ periodId }: { periodId: string }) => {
  return await axiosClient.get(`/employees/${periodId}`);
};

export const generateEmployees = async (body: FormData) => {
  return await axiosClient.post("/employees/generate", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAllByPeriodId = async ({
  periodId,
}: {
  periodId: string;
}) => {
  return await axiosClient.post(`/employees/delete-all/${periodId}`);
};

export const sendEmailByUserId = async ({ id }: { id: string }) => {
  return await axiosClient.post(`/employees/send-email/${id}`);
};

export const employeeById = async ({ id }: { id: string }) => {
  return await axiosClient.get(`/employees/detail/${id}`);
};
