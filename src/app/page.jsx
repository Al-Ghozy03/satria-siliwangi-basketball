"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import axios from "axios";
import { Moneys, Profile } from "iconsax-react";
import { useEffect, useState } from "react";

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
  const date = new Date()
  const [info, setInfo] = useState({
    loading: false,
    error: false,
    total: { siswa: 0, iuran: 0 },
  });

  const getInfo = async () => {
    try {
      setInfo({ loading: true, error: false, total: { ...info.total } });
      const endpoints = ["/siswa/total", "/iuran-bulanan/total-perbulan"];
      const req = endpoints.map(async (v) => await api_service.get(v));
      const res = await Promise.all(req);
      setInfo({
        error: false,
        loading: false,
        total: { siswa: res[0].data.total, iuran: res[1].data.total },
      });
    } catch (er) {
      console.log(er);
      setInfo({ loading: false, error: true, total: { ...info.total } });
    }
  };

  useEffect(() => {
    getInfo();
  }, []);
  return (
    <Layout name={"Dashboard"}>
      {/* info */}
      <div className="grid lg:grid-cols-3 gap-5">
        <CardInfo
          Icon={Profile}
          title={"jumlah siswa"}
          total={info?.total?.siswa}
          iconColor={"text-orange-400"}
          bgIconColor={"bg-orange-100"}
        />
        <CardInfo
          Icon={Moneys}
          title={`jumlah iuran bulan ${months[date.getMonth()]}`}
          total={info?.total?.iuran}
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
