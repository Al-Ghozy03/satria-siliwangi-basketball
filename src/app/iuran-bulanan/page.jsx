"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowDown2, CloseCircle, TickCircle } from "iconsax-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import * as yup from "yup";
import { months } from "../page";

const schema = yup
  .object({
    tanggal_pembayaran: yup.string().required(),
    status: yup.string().required(),
  })
  .required();

export default function IuranBulanan() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({
    loading: false,
    error: false,
    data: [],
    total: 0,
    total_page: 0,
    current_page: 1,
  });
  const [page, setPage] = useState(1);
  const getData = async () => {
    try {
      setData({
        error: false,
        loading: true,
        data: [],
        total: data.total,
        total_page: data.total_page,
        current_page: data.current_page,
      });
      const res = await api_service.get(`/iuran-bulanan?limit=15&page=${page}`);
      setData({
        error: false,
        loading: false,
        data: res.data,
        total: res.total,
        total_page: res.total_page,
        current_page: res.current_page,
      });
    } catch (er) {
      console.log(er);
      setData({
        error: true,
        loading: false,
        data: [],
        total: data.total,
        total_page: data.total_page,
        current_page: data.current_page,
      });
    }
  };
  useEffect(() => {
    getData();
  }, [page]);
  return (
    <Layout
      name={"Iuran Bulanan"}
      extra={
        <button
          onClick={() => setIsOpenCreate(true)}
          className="text-sm bg-[#FFE3B1] px-4 py-1 rounded-md font-semibold text-orange-500"
        >
          Add
        </button>
      }
    >
      <ModalCreate
        isOpen={isOpenCreate}
        setIsOpen={setIsOpenCreate}
        getData={getData}
      />
      <ModalDelete
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        data={selected}
        getData={getData}
      />
      <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg overflow-x-auto">
        {data.loading ? (
          "Loading..."
        ) : data.data.length === 0 ? (
          "Empty"
        ) : (
          <table className="w-full">
            <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
              <tr>
                <th className="font-semibold text-[#969696] text-sm w-1/4 lg:w-auto">
                  No
                </th>
                <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-60">
                  Nama Ayah
                </th>
                <th className="font-semibold text-[#969696] text-sm text-left">
                  Status
                </th>
                <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-auto">
                  Tanggal Pembayaran
                </th>
                <th className="font-semibold text-[#969696] text-sm text-center lg:text-left w-96 lg:w-auto">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((data, i) => {
                const date = new Date(data?.tanggal_pembayaran);
                return (
                  <tr key={i}>
                    <td className="text-sm text-center">{i + 1}</td>
                    <td className="text-sm">
                      {data?.orangtua?.nama_ayah
                        ? data?.orangtua?.nama_ayah
                        : "-"}
                    </td>
                    <td className="text-sm">
                      <div
                        className={`${
                          data.status === "terbayar"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-center text-white capitalize py-1 rounded-lg w-2/3 text-sm`}
                      >
                        {data.status}
                      </div>
                    </td>
                    <td className="text-sm">
                      {date.getDate()} {months[date.getMonth()]}{" "}
                      {date.getFullYear()}
                    </td>
                    <td className="text-sm">
                      <div className="flex space-x-3">
                        <button className="bg-blue-500 rounded-md p-1 text-white text-xs">
                          {/* <Edit className="h-4 w-4" /> */}Edit
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenDelete(true);
                            setSelected(data);
                          }}
                          className="bg-red-500 rounded-md p-1 text-white text-xs"
                        >
                          {/* <Trash className="h-4 w-4" /> */} Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <ReactPaginate
          containerClassName="flex space-x-3 text-xs justify-center mt-5 items-center"
          breakLabel="..."
          activeClassName="bg-orange-500 shadow-lg text-white"
          pageClassName="border border-orange-300 px-3 py-1.5 rounded-md"
          nextLabel={
            page !== data.total_page && (
              <button className="border border-orange-300 px-3 py-1.5 rounded-md">
                Next
              </button>
            )
          }
          onPageChange={({ selected }) => setPage(selected + 1)}
          pageRangeDisplayed={3}
          pageCount={data.total_page}
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

function ModalDelete({ isOpen, setIsOpen, data, getData }) {
  const deleteData = async () => {
    try {
      await api_service.delete(`/orangtua/delete/${data.id}`);
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
                  Apakah anda yakin ingin menghapus {data?.nama_ayah}
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

function ModalCreate({ isOpen, setIsOpen, getData }) {
  const [selectedOrangtua, setSelectedOrangtua] = useState([]);
  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState({
    loading: false,
    error: false,
    data: [],
  });
  const getList = async (q = "") => {
    try {
      setValue({ loading: true, error: false, data: [] });
      const res = await api_service.get(`/orangtua?page=1&limit=10&q=${q}`);
      setValue({ loading: false, error: false, data: res.data });
    } catch (er) {
      setValue({ loading: false, error: true, data: [] });
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (data) => {
    try {
      const final = [];
      for (let i = 0; i < selectedOrangtua.length; i++) {
        final.push({
          tanggal_pembayaran: data.tanggal_pembayaran,
          status: data.status,
          id_orangtua: selectedOrangtua[i].id,
        });
      }
      await api_service.post(`/iuran-bulanan/bulk`, final);
      getData();
      reset();
      setIsOpen(false);
    } catch (er) {
      console.log(er);
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setSelectedOrangtua([]);
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    getList();
  }, []);
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
                  Create
                </Dialog.Title>
                <form
                  autoComplete="off"
                  className="mt-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    label={"tanggal_pembayaran"}
                    register={register}
                    errors={errors}
                    type={"date"}
                  />
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"nama_ayah"}
                      className="capitalize text-sm font-medium"
                    >
                      Nama Ayah
                    </label>
                    <Combobox value={selected?.nama_ayah}>
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <Combobox.Input
                            className="w-full border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            onChange={(event) => getList(event.target.value)}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ArrowDown2 className="h-5 w-5 text-gray-400" />
                          </Combobox.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {value.data?.map((data, i) => (
                              <Combobox.Option
                                onClick={() => {
                                  setSelected(null);
                                  setSelectedOrangtua([
                                    ...selectedOrangtua,
                                    data,
                                  ]);
                                }}
                                key={i}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-teal-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={data}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {data.nama_ayah}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
                                        }`}
                                      >
                                        <TickCircle className="h-5 w-5" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        </Transition>
                      </div>
                    </Combobox>
                    <Item
                      selectedOrangtua={selectedOrangtua}
                      setSelectedOrangtua={setSelectedOrangtua}
                    />
                  </div>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"status"}
                      className="capitalize text-sm font-medium"
                    >
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="outline-none capitalize w-full h-9 rounded text-sm border border-gray-300 pl-2 focus:ring-1 focus:ring-orange-400"
                    >
                      <option className="capitalize" value="belum terbayar">
                        belum terbayar
                      </option>
                      <option className="capitalize" value="terbayar">
                        terbayar
                      </option>
                    </select>
                    <small className="text-red-500 italic text-xs">
                      {errors?.status?.message}
                    </small>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Item({ selectedOrangtua: data, setSelectedOrangtua: setData }) {
  const deleteOrangTua = (id) => {
    const deletedItem = data.filter((v) => v.id !== id);
    setData(deletedItem);
  };
  return (
    <div className="grid grid-cols-4 gap-3">
      {data?.map((v, j) => (
        <div
          key={j}
          className="bg-gray-300 rounded-full text-sm flex items-center space-x-2 justify-between py-1.5 px-3"
        >
          <p>
            {v?.nama_ayah.length <= 4
              ? v?.nama_ayah
              : `${v?.nama_ayah?.substring(0, 4)}...`}
          </p>{" "}
          <button onClick={() => deleteOrangTua(v.id)} type="button">
            <CloseCircle className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Input({ label, type, register, errors }) {
  return (
    <div className="grid gap-y-2 mt-2">
      <label htmlFor={label} className="capitalize text-sm font-medium">
        {label.replaceAll("_", " ")}
      </label>
      <input
        {...register(label)}
        placeholder="Type here..."
        type={type}
        className="outline-none h-9 rounded text-sm border border-gray-300 pl-2 focus:ring-1 focus:ring-orange-400"
      />
      {errors?.[label] && (
        <small className="text-red-500 italic text-xs">
          {errors?.[label].message}
        </small>
      )}
    </div>
  );
}
