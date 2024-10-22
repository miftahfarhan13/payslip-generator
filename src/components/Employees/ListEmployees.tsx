import { employees } from "@/services/employees";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import EmployeeItem from "./EmployeeItem";
import { Input } from "../ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function ListEmployees() {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");
  const employeeParams = searchParams.get("employee");
  const [keyword, setKeyword] = useState("");
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["employees", periodsParams],
    queryFn: () => employees({ periodId: periodsParams || "" }),
    enabled: !!periodsParams,
  });
  const filteredData = data?.data?.filter((fil: any) =>
    fil?.name?.toLowerCase()?.includes(keyword?.toLowerCase())
  );
  return (
    <div className="p-2.5 flex flex-col gap-5">
      {periodsParams && (
        <Input
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      )}

      {filteredData && filteredData?.length > 0 ? (
        <>
          <div className="flex flex-col gap-2.5">
            {filteredData?.map((employee: any) => (
              <Link
                href={`/?period=${periodsParams}&employee=${employee?.id}`}
                className="cursor-pointer"
              >
                <EmployeeItem
                  selectedEmployee={employeeParams}
                  employee={employee}
                />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          {periodsParams && (
            <div className="flex flex-col items-center justify-center content-center">
              <Icon icon="hugeicons:wallet-not-found-01" fontSize={20} />
              <p className="text-sm">Data empty</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
