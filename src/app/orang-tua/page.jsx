"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import { Edit, Trash } from "iconsax-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrangTua() {
  const [data, setData] = useState({ loading: false, error: false, data: [] });
  const getData = async () => {
    try {
      setData({ error: false, loading: true, data: [] });
      const res = await api_service.get("/orangtua");
      setData({ error: false, loading: false, data: res.data });
    } catch (er) {
      console.log(er);
      setData({ error: true, loading: false, data: [] });
    }
  };
  console.log(data);
  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout name={"Orang tua"}>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm w-1/4 lg:w-auto">
                No
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-auto">
                Nama Ayah
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-96 lg:w-auto">
                No Hp Ayah
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-auto">
                Nama Ibu
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-96 lg:w-auto">
                No Hp Ibu
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-96 lg:w-auto">
                Alamat
              </th>
              <th className="font-semibold text-[#969696] text-sm text-center lg:text-left w-96 lg:w-auto">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.loading
              ? "Loading..."
              : data.data.length === 0
              ? "Empty"
              : data.data?.map((data, i) => (
                  <tr key={i}>
                    <td className="text-sm text-center">{i + 1}</td>
                    <td className="text-sm">{data.nama_ayah}</td>
                    <td className="text-sm">{data.no_telepon_ayah}</td>
                    <td className="text-sm">{data.nama_ibu}</td>
                    <td className="text-sm">{data.no_telepon_ibu}</td>
                    <td className="text-sm">{data.alamat}</td>
                    <td className="text-sm">
                      <div className="flex space-x-3">
                        <Link
                          href={`/orang-tua/${data.id}`}
                          className="bg-blue-500 rounded-md p-1 text-white text-xs"
                        >
                          {/* <Edit className="h-4 w-4" /> */}Detail
                        </Link>
                        <button className="bg-red-500 rounded-md p-1 text-white text-xs">
                          {/* <Trash className="h-4 w-4" /> */} Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
