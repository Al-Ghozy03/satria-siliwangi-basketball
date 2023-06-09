"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "@/components/layout";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import api_service from "@/api/api_service";
import { ArrowDown2, TickCircle } from "iconsax-react";
import { months } from "../page";
import ReactPaginate from "react-paginate";
import Loading from "@/components/loading";
import { Icon } from "@iconify/react";

const schema = yup
  .object({
    tanggal: yup.string().required(),
    jam: yup.string().required(),
    status: yup.string().required(),
  })
  .required();

export default function Absensi() {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [data, setData] = useState({
    loading: false,
    error: false,
    data: [],
    total: 0,
    total_page: 0,
    current_page: 1,
  });
  const [date, setDate] = useState(null);
  const [page, setPage] = useState(1);
  const getData = async () => {
    try {
      setData({
        loading: true,
        error: false,
        data: [],
        total: data.total,
        total_page: data.total_page,
        current_page: data.current_page,
      });
      const res = await api_service.get(
        `/absensi?${date && `date=${date}`}&page=${page}&limit=15`
      );
      setData({
        loading: false,
        error: false,
        data: res.data,
        total: res.total,
        total_page: res.total_page,
        current_page: res.current_page,
      });
    } catch (er) {
      setData({
        loading: false,
        error: true,
        data: [],
        total: data.total,
        total_page: data.total_page,
        current_page: data.current_page,
      });
    }
  };

  useEffect(() => {
    getData();
  }, [date, page]);
  return (
    <Layout
      name={"Absensi"}
      extra={
        <div className="flex space-x-2">
          <input
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="outline-none h-9 rounded text-sm border border-gray-300 pl-2 focus:ring-1 focus:ring-orange-400"
          />
          <button
            onClick={() => setIsOpenCreate(true)}
            className="text-sm bg-[#FFE3B1] px-4 py-2 rounded-md font-semibold text-orange-500"
          >
            Tambah
          </button>
        </div>
      }
    >
      <ModalDelete
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        data={selected}
        getData={getData}
      />
      <ModalEdit
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        getData={getData}
        date={date}
        value={selected}
      />
      <ModalCreate
        isOpen={isOpenCreate}
        setIsOpen={setIsOpenCreate}
        getData={getData}
        date={date}
      />
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
              <th className="font-semibold text-[#969696] text-sm text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.loading
              ? [...new Array(4).keys()].map((data, i) => (
                  <tr key={i}>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                    <td>
                      <Loading className={"w-full h-6 rounded mt-2"} />
                    </td>
                  </tr>
                ))
              : data.data?.map((data, i) => {
                  const date = new Date(data.tanggal);
                  return (
                    <tr key={i}>
                      <td className="text-sm text-center">{i + 1}</td>
                      <td className="text-sm">{data.siswa?.nama}</td>
                      <td className="text-sm">
                        {date.getDate()} {months[date.getMonth()]}{" "}
                        {date.getFullYear()}
                      </td>
                      <td className="text-sm">{data.jam.substring(0, 5)}</td>
                      <td className="text-sm">
                        <div
                          className={`capitalize text-center text-white text-xs py-1.5 w-2/3 rounded-md ${
                            data.status === "hadir"
                              ? "bg-green-500"
                              : "bg-red-600"
                          }`}
                        >
                          {data.status}
                        </div>
                      </td>
                      <td className="text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setIsOpenEdit(true);
                              setSelected(data);
                            }}
                            className="bg-blue-500 rounded-md p-1 text-white text-xs"
                          >
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

function ModalEdit({ isOpen, setIsOpen, getData, date, value }) {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ loading: false, error: false, data: [] });
  const getList = async (q = "") => {
    try {
      setData({ loading: true, error: false, data: [] });
      const res = await api_service.get(`/siswa?page=1&limit=10&q=${q}`);
      setData({ loading: false, error: false, data: res.data });
    } catch (er) {
      setData({ loading: false, error: true, data: [] });
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
      setIsLoading(true);
      await api_service.put(`/absensi/edit/${value?.id}`, {
        ...data,
        id_siswa: selected.id,
      });
      getData(date);
      reset();
      setIsOpen(false);
      setIsLoading(false);
    } catch (er) {
      setIsLoading(false);
      console.log(er);
    }
  };
  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    reset();
    setSelected(value?.siswa);
  }, [isOpen, reset]);

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6"
                >
                  Edit Absensi
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"nama_siswa"}
                      className="capitalize text-sm font-medium"
                    >
                      nama siswa
                    </label>
                    <Combobox value={selected?.nama} onChange={setSelected}>
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
                            {data.data?.map((data, i) => (
                              <Combobox.Option
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
                                      {data.nama}
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
                  </div>
                  <Input
                    type={"date"}
                    label={"tanggal"}
                    register={register}
                    errors={errors}
                    value={value?.tanggal}
                  />
                  <Input
                    type={"time"}
                    label={"jam"}
                    register={register}
                    errors={errors}
                    value={value?.jam}
                  />
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"status"}
                      className="capitalize text-sm font-medium"
                    >
                      Status
                    </label>
                    <select
                      {...register("status", { value: value?.status })}
                      defaultValue={value?.status}
                      className="outline-none w-full h-9 rounded text-sm border border-gray-300 pl-2 focus:ring-1 focus:ring-orange-400"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak hadir">Tidak Hadir</option>
                    </select>
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
                      {isLoading ? (
                        <Icon
                          className="animate-spin h-6 w-6"
                          icon="mdi:loading"
                        />
                      ) : (
                        "Submit"
                      )}
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
function ModalCreate({ isOpen, setIsOpen, getData, date }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ loading: false, error: false, data: [] });
  const getList = async (q = "") => {
    try {
      setData({ loading: true, error: false, data: [] });
      const res = await api_service.get(`/siswa?page=1&limit=10&q=${q}`);
      setData({ loading: false, error: false, data: res.data });
    } catch (er) {
      setData({ loading: false, error: true, data: [] });
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
      setIsLoading(true);
      await api_service.post(`/absensi/create`, {
        ...data,
        id_siswa: selected.id,
      });
      getData(date);
      reset();
      setIsOpen(false);
      setIsLoading(false);
    } catch (er) {
      setIsLoading(false);
      console.log(er);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    reset();
  }, [isOpen, reset]);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6"
                >
                  Tambah Absensi
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"nama_siswa"}
                      className="capitalize text-sm font-medium"
                    >
                      nama siswa
                    </label>
                    <Combobox value={selected?.nama} onChange={setSelected}>
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
                            {data.data?.map((data, i) => (
                              <Combobox.Option
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
                                      {data.nama}
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
                  </div>
                  <Input
                    type={"date"}
                    label={"tanggal"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    type={"time"}
                    label={"jam"}
                    register={register}
                    errors={errors}
                  />
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"status"}
                      className="capitalize text-sm font-medium"
                    >
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="outline-none w-full h-9 rounded text-sm border border-gray-300 pl-2 focus:ring-1 focus:ring-orange-400"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak hadir">Tidak Hadir</option>
                    </select>
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
                      {isLoading ? (
                        <Icon
                          className="animate-spin h-6 w-6"
                          icon="mdi:loading"
                        />
                      ) : (
                        "Submit"
                      )}
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
function ModalDelete({ isOpen, setIsOpen, data, getData }) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteData = async () => {
    try {
      setIsLoading(true)
      await api_service.delete(`/absensi/delete/${data.id}`);
      getData();
      setIsOpen(false);
      setIsLoading(false)
    } catch (er) {
      setIsLoading(false)
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
                  Apakah anda yakin ingin menghapus {data?.siswa.nama}
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
                    {isLoading?<Icon className="animate-spin h-6 w-6" icon="mdi:loading" />:"Yes"}
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

function Input({ label, type, register, errors, value }) {
  return (
    <div className="grid gap-y-2 mt-2">
      <label htmlFor={label} className="capitalize text-sm font-medium">
        {label.replaceAll("_", " ")}
      </label>
      <input
        {...register(label, { ...(value !== undefined && { value }) })}
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
