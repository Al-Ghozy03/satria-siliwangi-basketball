"use client";
import Layout from "@/components/layout";
import {
  Moneys,
  Profile,
} from "iconsax-react";
import { useState } from "react";

export const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export default function Home() {
  const series = [
    {
      name: "Hadir",
      data: [10, 21, 10, 14],
    },
    {
      name: "Tidak Hadir",
      data: [5, 0, 13, 7],
    },
  ];
  const options = {
    chart: { type: "area", toolbar: { show: false } },
    colors: ["#00E396", "#FF4444"],
    xaxis: {
      categories: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
      labels: {
        style: {
          color: "#A3AED0",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 3 },
    legend: { show: false },
    stroke: { curve: "smooth" },
    tooltip: { style: { fontSize: "12px" }, theme: "dark" },
  };

  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );

  return (
    <Layout name={"Dashboard"} >
      {/* info */}
      <div className="grid grid-cols-3 gap-x-5">
        <CardInfo
          Icon={Profile}
          title={"jumlah siswa"}
          total={40}
          iconColor={"text-orange-400"}
          bgIconColor={"bg-orange-100"}
        />
        <CardInfo
          Icon={Moneys}
          title={"jumlah iuran"}
          total={35}
          iconColor={"text-green-400"}
          bgIconColor={"bg-green-100"}
        />
      </div>
      {/* info */}

    </Layout>
  );
}

function CardInfo({ Icon, title, total, iconColor, bgIconColor }) {
  return (
    <div className="bg-white shadow-xl shadow-gray-200 w-full h-20 rounded-2xl flex items-center px-5 space-x-3">
      <div
        className={`h-11 w-11 ${bgIconColor} rounded-full flex items-center justify-center`}
      >
        <Icon className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-500 capitalize">{title}</p>
        <h3 className="font-semibold text-lg">{total}</h3>
      </div>
    </div>
  );
}
