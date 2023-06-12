"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Dialog, Transition } from "@headlessui/react";
import { months } from "../page";
import ReactPaginate from "react-paginate";

export default function Siswa() {
  const [data, setData] = useState({
    loading: false,
    error: false,
    data: [],
    total: 0,
    current_page: 0,
  });
  const options = ["KU 10 MIX", "KU 12", "KU 14", "KU 16", "Senior"];
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [totalPage, setTotalPage] = useState(0);

  const getData = async (page) => {
    try {
      setData({
        loading: true,
        error: false,
        data: [],
        total: data.total,
        current_page: data.current_page,
      });
      const res = await api_service.get(`/siswa?page=${page}&limit=10`);
      setData({
        loading: false,
        error: false,
        data: res.data,
        total: res.total,
        current_page: page,
      });
      setTotalPage(res.total_page);
    } catch (er) {
      setData({
        loading: false,
        error: true,
        data: [],
        total: data.total,
        current_page: data.current_page,
      });
    }
  };

  const onPageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  return (
    <Layout name={"Siswa"}>
      <ModalDelete
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        data={selected}
        getData={getData}
      />
      <ModalDetail
        isOpen={isOpenDetail}
        setIsOpen={setIsOpenDetail}
        data={selected}
      />
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg overflow-x-auto h-full">
        {data.loading ? (
          <Icon icon="mdi:loading" className="h-10 w-10 animate-spin mx-auto" />
        ) : (
          <table className="w-full table-auto">
            <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
              <tr>
                <th className="font-semibold text-[#969696] text-sm ">No</th>
                <th className="font-semibold text-[#969696] text-sm w-60 text-left">
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
              {data.data?.map((data, i) => (
                <tr key={i}>
                  <td className="text-sm text-center">{i + 1}</td>
                  <td className="text-sm">{data.nama ? data.nama : "-"}</td>
                  <td className="text-sm">{data.no_induk_ss? data.no_induk_ss : "-"}</td>
                  <td className="text-sm">
                    <select
                      defaultValue={data.ku_genap}
                      className="outline-none w-44 lg:w-3/4 text-sm py-1.5 px-2 rounded-md appearance-none"
                    >
                      {options.map((v, j) => (
                        <option key={j} className="text-sm" value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelected(data);
                          setIsOpenDetail(true);
                        }}
                        className="bg-blue-500 rounded-md p-1 text-white text-xs"
                      >
                        {/* <Edit className="h-4 w-4" /> */}Detail
                      </button>
                      <button
                        onClick={() => {
                          setSelected(data);
                          setIsOpenDelete(true);
                        }}
                        className="bg-red-500 rounded-md p-1 text-white text-xs"
                      >
                        {/* <Trash className="h-4 w-4" /> */} Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ReactPaginate
          containerClassName="flex space-x-3 text-xs justify-center mt-5 items-center"
          breakLabel="..."
          activeClassName="bg-orange-500 shadow-lg text-white"
          pageClassName="border border-orange-300 px-3 py-1.5 rounded-md"
          nextLabel={
            page !== totalPage && (
              <button className="border border-orange-300 px-3 py-1.5 rounded-md">
                Next
              </button>
            )
          }
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          pageCount={totalPage}
          previousLabel={
            page !== 1 && (
              <button className="border border-orange-300 px-3 py-1.5 rounded-md">
                Prev
              </button>
            )
          }
          renderOnZeroPageCount={null}
        />
      </div>
    </Layout>
  );
}

function ModalDetail({ isOpen, setIsOpen, data }) {
  const date = new Date(data?.tanggal_lahir);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full bg-gray-300"></div>
                  <div>
                    <h1 className="text-lg font-semibold">{data?.nama}</h1>
                    <p className="text-gray-400 text-sm">{data?.no_induk_ss}</p>
                  </div>
                </div>
                <h1 className="text-lg font-semibold mt-2">
                  Informasi Personal
                </h1>
                <div className="flex justify-between">
                  <div>
                    <Info title={"Nama"} value={data?.nama} />
                    <Info title={"Jenis Kelamin"} value={data?.jenis_kelamin} />
                    <Info title={"Asal Sekolah"} value={data?.sekolah} />
                  </div>
                  <div>
                    <Info title={"NIS"} value={data?.no_induk_ss} />
                    <Info
                      title={"Tempat Tanggal Lahir"}
                      value={`${data?.tempat_lahir}, ${date.getDate()} ${
                        months[date.getMonth()]
                      } ${date.getFullYear()}`}
                    />
                    <Info title={"Kelompok Umur"} value={data?.ku_genap} />
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border mt-4 border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Info({ title, value }) {
  return (
    <div className="mt-2 text-[0.840rem]">
      <h3 className="text-gray-500">{title}</h3>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function ModalDelete({ isOpen, setIsOpen, data, getData }) {
  const deleteData = async () => {
    try {
      await api_service.delete(`/siswa/delete/${data.id}`);
      getData();
      setIsOpen(false);
    } catch (er) {
      console.log(er);
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6"
                >
                  Apakah anda yakin ingin menghapus {data?.nama}
                </Dialog.Title>
                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteData}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Yes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
