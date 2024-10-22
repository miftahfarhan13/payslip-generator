import EmployeeDetail from "@/components/Employees/EmployeeDetail";
import GenerateEmployees from "@/components/Employees/GenerateEmployees";
import ListEmployees from "@/components/Employees/ListEmployees";
import Period from "@/components/Period";
import DetailPeriod from "@/components/Period/DetailPeriod";
import { periodById } from "@/services/period";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ModalAddPeriod = dynamic(
  () => import("../components/Period/ModalAddPeriod"),
  {
    ssr: true,
  }
);

export default function Home() {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");
  const employeeParams = searchParams.get("employee");

  const { data } = useQuery({
    queryKey: ["period", periodsParams],
    queryFn: () => periodById({ id: periodsParams || "" }),
    enabled: !!periodsParams,
  });

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-[1280px] mx-auto px-5 w-full">
          <div className="rounded-[10px] shadow-sm overflow-hidden border border-[#e4e4e7] h-[calc(100dvh_-_80px)] w-full">
            <div className="flex flex-row h-full w-full">
              <div className="flex flex-col w-1/6 border-r">
                <div className="p-2.5 text-xl font-bold border-b border-[#e4e4e7] min-h-[57px]">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-xl font-bold">Periods</p>
                    <ModalAddPeriod type="create" />
                  </div>
                </div>
                <div className="max-h-[calc(100dvh_-_80px_-_57px)] overflow-auto">
                  <Period />
                </div>
              </div>
              <div className="flex flex-col w-2/6 border-r">
                <div className="p-2.5 border-b min-h-[57px] content-center">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-xl font-bold">Employees</p>
                    <div className="flex flex-row gap-2.5 items-center">
                      <GenerateEmployees periodName={data?.data?.name} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <DetailPeriod
                    id={data?.data?.id}
                    name={data?.data?.name}
                    date={data?.data?.date}
                  />
                  <div className="max-h-[calc(100dvh_-_80px_-_57px_-_60px)] overflow-auto">
                    <ListEmployees />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-3/6">
                <div className="p-2.5 text-xl font-bold border-b border-[#e4e4e7] min-h-[57px] content-center">
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-xl font-bold">Detail Employee</p>
                  </div>
                </div>
                {employeeParams && (
                  <EmployeeDetail employeeId={employeeParams} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
