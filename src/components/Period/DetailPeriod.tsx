import { periodById } from "@/services/period";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import React from "react";
import ModalAddPeriod from "./ModalAddPeriod";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function DetailPeriod() {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["period", periodsParams],
    queryFn: () => periodById({ id: periodsParams || "" }),
  });
  return (
    <div className="p-2.5 overflow-auto">
      <div className="flex flex-col gap-5">
        {periodsParams ? (
          <>
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col">
                <p className="font-bold">{data?.data?.name}</p>
                <p className="text-xs">
                  Period: {moment(new Date(data?.data?.date)).format("MM-YYYY")}
                </p>
              </div>

              <ModalAddPeriod
                id={data?.data?.id}
                nameProps={data?.data?.name}
                periodProps={data?.data?.date}
                type="update"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center ">
              <Icon icon="grommet-icons:select" fontSize={20} />
              <p className="text-sm">Select Period</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
