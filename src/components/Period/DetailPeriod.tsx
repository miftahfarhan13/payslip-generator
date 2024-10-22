import { periodById } from "@/services/period";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import React from "react";
import ModalAddPeriod from "./ModalAddPeriod";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModalDeleteAllEmployee from "../Employees/ModalDeleteAllEmployees";

export default function DetailPeriod({
  name,
  date,
  id,
}: {
  name: string;
  date: string;
  id: string;
}) {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");
  return (
    <div className="p-2.5 overflow-auto">
      <div className="flex flex-col gap-5">
        {periodsParams ? (
          <>
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col">
                <p className="font-bold">{name}</p>
                <p className="text-xs">
                  Period: {moment(new Date(date)).format("MM-YYYY")}
                </p>
              </div>

              <div className="flex flex-row gap-2.5 items-center">
                <ModalAddPeriod
                  id={id}
                  nameProps={name}
                  periodProps={date}
                  type="update"
                />
                <ModalDeleteAllEmployee id={id} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center content-center mt-5">
              <Icon icon="grommet-icons:select" fontSize={20} />
              <p className="text-sm">Select Period</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
