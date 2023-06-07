"use client";
import Layout from "@/components/layout";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDown2 } from "iconsax-react";
import { Fragment } from "react";

export default function DetailOrangTua() {
  return (
    <Layout name={"Orang Tua"}>
      <div className="flex space-x-5">
        <Info title={"Nama Ayah"} value={"John Doe"} />
        <Info title={"Nama Ibu"} value={"Jane Doe"} />
      </div>
      <Info title={"Nama Siswa"} value={"Jane Doe"} />
      <Info title={"Alamat"} value={"Cempaka Putih, Jakarta"} />
      <Info title={"Tanggal Pembayaran"} value={"20 Juni 2023"} />
      {/*  */}
      <h3 className="text-gray-500 text-sm mt-2">Iuran Bulanan</h3>
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg">
        <table>
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm text-left w-1/4">
                Bulan
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left">
                Status Pembayaran
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-1/4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm">Januari</td>
              <td className="text-sm">
                <div className="bg-red-500 text-white text-center text-xs rounded-lg py-1.5 w-32">
                  Belum Terbayar
                </div>
              </td>
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
                              Terbayar
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-violet-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                            >
                              Belum Terbayar
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function Info({ title, value }) {
  return (
    <div className="mt-2">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="font-medium">{value}</p>
    </div>
  );
}
