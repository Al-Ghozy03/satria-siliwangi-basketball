"use client";
import Layout from "@/components/layout";

export default function Absensi() {
  return (
    <Layout name={"Absensi"}>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg overflow-x-auto h-full">
        <table className="w-full table-auto">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm ">No</th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Nama
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Tanggal
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Jam
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm text-center">1</td>
              <td className="text-sm">Muhammad Faiz Al Ghozi</td>
              <td className="text-sm">20 Agustus 2023</td>
              <td className="text-sm">11.00</td>
              <td className="text-sm">
                <select className="outline-none w-44 lg:w-3/4 text-sm py-1.5 px-2 rounded-md appearance-none">
                  <option className="text-sm" value="Hadir">
                    Hadir
                  </option>
                  <option className="text-sm" value="Tidak Hadir">
                    Tidak Hadir
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
