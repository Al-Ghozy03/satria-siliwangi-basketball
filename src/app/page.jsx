"use client";
import Layout from "@/components/layout";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowDown2,
  Moneys,
  Profile,
} from "iconsax-react";
import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

      {/* chart */}
      <div className="bg-white rounded-xl w-1/2 mt-10 h-64 pb-14">
        <div className="flex px-4 pt-4 justify-between">
          <h1 className="text-2xl font-semibold">Kehadiran</h1>
          <Menu
            as="div"
            className="relative inline-block text-left bg-white z-40 text-xs"
          >
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-xs font-medium">
                {selectedMonth}
                <ArrowDown2 className="h-4 w-4 ml-2" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {months.map((data, i) => (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedMonth(data)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                        >
                          {data}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <Chart
          options={options}
          series={series}
          type="area"
          width="100%"
          height="100%"
        />
      </div>
      {/* chart */}
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
