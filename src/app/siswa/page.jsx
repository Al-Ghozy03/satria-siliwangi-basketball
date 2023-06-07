"use client";
import Layout from "@/components/layout";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDown2 } from "iconsax-react";
import { Fragment } from "react";

export default function Siswa() {
  return (
    <Layout name={"Siswa"}>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg">
        <table className="w-full">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm">No</th>
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
                <Menu
                  as="div"
                  className="relative inline-block text-left bg-white z-40 text-xs"
                >
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-xs font-medium">
                      Pilih
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
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                            >
                              Lunas
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </td>
              <td className="text-sm">
                <div className="flex space-x-3">
                  <button className="bg-blue-500 rounded-md p-1 text-white text-xs">
                    {/* <Edit className="h-4 w-4" /> */}Edit
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
