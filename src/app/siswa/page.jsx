"use client";
import Layout from "@/components/layout";

export default function Siswa() {
  return (
    <Layout name={"Siswa"}>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg overflow-x-auto h-full">
        <table className="w-full table-auto">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm ">No</th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Nama
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                NIS
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Kelompok Umur
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm text-center">1</td>
              <td className="text-sm">Muhammad Faiz Al Ghozi</td>
              <td className="text-sm">87818197732</td>
              <td className="text-sm">
                <select className="outline-none w-44 lg:w-3/4 text-sm py-1.5 px-2 rounded-md appearance-none">
                  <option className="text-sm" value="KU MIX 16 Putra">KU MIX 16 Putra</option>
                  <option className="text-sm" value="KU MIX 14 Putra">KU MIX 14 Putra</option>
                </select>
              </td>
              <td className="text-sm">
                <div className="flex space-x-3">
                  <button className="bg-blue-500 rounded-md p-1 text-white text-xs">
                    {/* <Edit className="h-4 w-4" /> */}Detail
                  </button>
                  <button className="bg-red-500 rounded-md p-1 text-white text-xs">
                    {/* <Trash className="h-4 w-4" /> */} Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
