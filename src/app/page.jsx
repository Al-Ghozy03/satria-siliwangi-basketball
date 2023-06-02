"use client";
import Layout from "@/components/layout";
import { NoteRemove, Profile, Stickynote } from "iconsax-react";

export default function Home() {
  return (
    <Layout name={"dashboard"}>
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
          Icon={Stickynote}
          title={"jumlah hadir"}
          total={35}
          iconColor={"text-green-400"}
          bgIconColor={"bg-green-100"}
        />
        <CardInfo
          Icon={NoteRemove}
          title={"jumlah tidak hadir"}
          total={5}
          iconColor={"text-red-400"}
          bgIconColor={"bg-red-100"}
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
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="font-semibold text-lg">{total}</h3>
      </div>
    </div>
  );
}
