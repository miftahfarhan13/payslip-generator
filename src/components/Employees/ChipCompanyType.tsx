import React from "react";

export default function ChipCompanyType({
  companyType,
}: {
  companyType: string;
}) {
  const theme: any = {
    Dibimbing: {
      color: "#00a1c7",
      borderColor: "#00a1c7",
    },
    Cakrawala: {
      color: "#109f81",
      borderColor: "#109f81",
    },
    Dibilabs: {
      color: "#f06923",
      borderColor: "#f06923",
    },
  };
  return (
    <div
      className="text-xs border p-1 rounded-sm"
      style={{
        color: theme[companyType].color,
        borderColor: theme[companyType].borderColor,
      }}
    >
      {companyType}
    </div>
  );
}
