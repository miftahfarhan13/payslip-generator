import { periods } from "@/services/period";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { truncate } from "@/utils/string";

export default function Period() {
  const searchParams = useSearchParams();
  const periodsParams = searchParams.get("period");
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["periods"],
    queryFn: periods,
  });
  return (
    <div className="p-2.5 overflow-auto">
      <div className="flex flex-col gap-2">
        {data?.data?.map((period: any) => (
          <Link href={`/?period=${period?.id}`} passHref>
            <div
              className="px-2.5 py-2.5 rounded-md hover:bg-[#f4f4f5] cursor-pointer"
              style={{
                backgroundColor: periodsParams === period?.id ? "black" : "",
              }}
            >
              <div
                className="flex flex-row gap-2.5 items-center justify-between"
                style={{
                  color: periodsParams === period?.id ? "white" : "black",
                  fontWeight: periodsParams === period?.id ? "600" : "400",
                }}
              >
                <div className="flex flex-row gap-2.5 items-center">
                  <Icon icon="formkit:folder"></Icon>
                  <p className="text-sm">{truncate(period?.name, 13)}</p>
                </div>
                <p className="text-sm">{period?._count?.users}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
