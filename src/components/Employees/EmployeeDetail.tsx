import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { generateAliasName } from "@/utils/string";
import moment from "moment";
import ButtonSendEmail from "./ButtonSendEmail";
import { useQuery } from "@tanstack/react-query";
import { employeeById } from "@/services/employees";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function EmployeeDetail({ employeeId }: { employeeId: string }) {
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => employeeById({ id: employeeId }),
    enabled: !!employeeId,
  });
  const employee: any = data?.data;
  return (
    <>
      {employee?.id ? (
        <>
          <div className="p-2.5 h-full">
            <div className="flex flex-col gap-5">
              <div className="flex flex-row gap-2.5 items-start justify-between">
                <div className="flex flex-row gap-2.5 items-start">
                  <Avatar>
                    <AvatarFallback>
                      {generateAliasName(employee?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-sm font-semibold">{employee?.name}</p>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: employee?.isSendEmail
                            ? "#4ade80"
                            : "#f87171",
                        }}
                      />
                    </div>
                    <p className="text-xs">{employee?.email}</p>
                  </div>
                </div>
                <p className="text-xs text-[#71717a]">
                  {moment(new Date(employee?.createDate)).fromNow()}
                </p>
              </div>

              <ButtonSendEmail id={employeeId} />

              {employee?.fileUrl && (
                <iframe className="h-[600px]" src={employee?.fileUrl} />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center content-center mt-10">
            <Icon icon="hugeicons:wallet-not-found-01" fontSize={20} />
            <p className="text-sm">Employee not found</p>
          </div>
        </>
      )}
    </>
  );
}
