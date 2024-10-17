import GenerateEmployees from "@/components/Employees/GenerateEmployees";
import Period from "@/components/Period";
import DetailPeriod from "@/components/Period/DetailPeriod";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import dynamic from "next/dynamic";
import React from "react";

const ModalAddPeriod = dynamic(
  () => import("../components/Period/ModalAddPeriod"),
  {
    ssr: true,
  }
);

export default function Home() {
  return (
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
              <Period />
            </div>
            <div className="flex flex-col w-2/6 border-r">
              <div className="p-2.5 border-b min-h-[57px] content-center">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xl font-bold">Employees</p>
                  <div className="flex flex-row gap-2.5 items-center">
                    {/* <Button size="icon" variant="outline">
                      <Icon icon="carbon:generate-pdf" />
                    </Button> */}
                    <GenerateEmployees />
                  </div>
                </div>
              </div>
              <DetailPeriod />
            </div>
            <div className="flex flex-col w-3/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
