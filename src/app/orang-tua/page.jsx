import Layout from "@/components/layout";
import { Edit, Trash } from "iconsax-react";
import Link from "next/link";

export default function OrangTua() {
  return (
    <Layout name={"Orang tua"}>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg">
        <table className="w-full">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm">No</th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Nama
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                WhatsApp
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
              <td className="text-sm">+62 878 1819 7732</td>
              <td className="text-sm">
                <div className="flex space-x-3">
                  <Link href={"/orang-tua/2"} className="bg-blue-500 rounded-md p-1 text-white text-xs">
                    {/* <Edit className="h-4 w-4" /> */}Edit
                  </Link>
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
