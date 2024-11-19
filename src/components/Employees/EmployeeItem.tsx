import React from "react";
import moment from "moment";
import ChipCompanyType from "./ChipCompanyType";

export default function EmployeeItem({
  selectedEmployee,
  employee,
}: {
  selectedEmployee: any;
  employee: any;
}) {
  return (
    <div
      className="border border-[#e4e4e7] p-2.5 rounded-md"
      style={{
        backgroundColor: selectedEmployee === employee?.id ? "#f4f4f5" : "",
      }}
    >
      <div className="flex flex-row gap-2.5 items-start justify-between">
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm font-semibold">{employee?.name}</p>
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: employee?.isSendEmail ? "#4ade80" : "#f87171",
              }}
            />
          </div>
          <p className="text-xs mb-2">{employee?.email}</p>
          <ChipCompanyType companyType={employee?.companyType} />
        </div>
        <p className="text-xs text-[#71717a]">
          {moment(new Date(employee?.createDate)).fromNow()}
        </p>
      </div>
    </div>
  );
}
