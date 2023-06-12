"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { months } from "../page";
import ReactPaginate from "react-paginate";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowDown2 } from "iconsax-react";

const schema = yup
  .object({
    no_induk_ss: yup.string().required(),
    ku_genap: yup.string().required(),
    jenis_kelamin: yup.string().required(),
    tempat_lahir: yup.string().required(),
    tanggal_lahir: yup.string().required(),
    sekolah: yup.string().required(),
    no_jersey: yup.string().required(),
  })
  .required();

const options = ["KU 10 MIX", "KU 12", "KU 14", "KU 16", "Senior"];
export default function Siswa() {
  const [data, setData] = useState({
    loading: false,
    error: false,
    data: [],
    total: 0,
    current_page: 0,
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

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
    <Layout
      name={"Siswa"}
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
        getData={getData}
        isOpen={isOpenCreate}
        setIsOpen={setIsOpenCreate}
        page={page}
        />
      <ModalDelete
        isOpen={isOpenDelete}
        page={page}
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
                  <td className="text-sm">
                    {data.no_induk_ss ? data.no_induk_ss : "-"}
                  </td>
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

function ModalDelete({ isOpen, setIsOpen, data, getData,page }) {
  const deleteData = async () => {
    try {
      await api_service.delete(`/siswa/delete/${data.id}`);
      getData(page);
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
function ModalEdit({ isOpen, setIsOpen, getData, page }) {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ loading: false, error: false, data: [] });
  const getList = async (q = "") => {
    try {
      setData({ loading: true, error: false, data: [] });
      const res = await api_service.get(`/orangtua?page=1&limit=10&q=${q}`);
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
      const formdata = new FormData();
      formdata.append("no_induk_ss", data.no_induk_ss);
      formdata.append("ku_genap", data.ku_genap);
      formdata.append("nama", data.nama);
      formdata.append("id_orangtua", selected.id);
      formdata.append("jenis_kelamin", data.jenis_kelamin);
      formdata.append("tempat_lahir", data.tempat_lahir);
      formdata.append("tanggal_lahir", data.tanggal_lahir);
      formdata.append("sekolah", data.sekolah);
      formdata.append("no_jersey", data.no_jersey);
      formdata.append("foto_siswa", data.foto_siswa[0]);
      await api_service.post(`/siswa/add`, formdata);
      getData(page);
      reset();
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
                  Tambah siswa
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label={"no_induk_ss"}
                    register={register}
                    errors={errors}
                  />
                  <Input label={"nama"} register={register} errors={errors} />
                  <Input
                    label={"tempat_lahir"}
                    register={register}
                    errors={errors}
                  />
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"ku_genap"}
                      className="capitalize text-sm font-medium"
                    >
                      Kelompok umur
                    </label>
                    <select
                      {...register("ku_genap")}
                      className="outline-none w-full text-sm py-1.5 px-2 rounded-md appearance-none"
                    >
                      {options.map((v, j) => (
                        <option key={j} className="text-sm" value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"nama_orangtua"}
                      className="capitalize text-sm font-medium"
                    >
                      nama orangtua
                    </label>
                    <Combobox
                      value={selected?.nama_ayah}
                      onChange={setSelected}
                    >
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
                  </div>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"jenis_kelamin"}
                      className="capitalize text-sm font-medium"
                    >
                      Jenis kelamin
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center mb-4">
                        <input
                          {...register("jenis_kelamin")}
                          type="radio"
                          value="laki-laki"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                        />
                        <label className="ml-2 text-xs">Laki laki</label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          {...register("jenis_kelamin")}
                          type="radio"
                          value="perempuan"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                        />
                        <label className="ml-2 text-xs">Perempuan</label>
                      </div>
                    </div>
                  </div>
                  <Input
                    label={"tanggal_lahir"}
                    type={"date"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"sekolah"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"no_jersey"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"foto_siswa"}
                    register={register}
                    errors={errors}
                    type={"file"}
                  />
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
function ModalCreate({ isOpen, setIsOpen, getData, page }) {
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ loading: false, error: false, data: [] });
  const getList = async (q = "") => {
    try {
      setData({ loading: true, error: false, data: [] });
      const res = await api_service.get(`/orangtua?page=1&limit=10&q=${q}`);
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
      const formdata = new FormData();
      formdata.append("no_induk_ss", data.no_induk_ss);
      formdata.append("ku_genap", data.ku_genap);
      formdata.append("nama", data.nama);
      formdata.append("id_orangtua", selected.id);
      formdata.append("jenis_kelamin", data.jenis_kelamin);
      formdata.append("tempat_lahir", data.tempat_lahir);
      formdata.append("tanggal_lahir", data.tanggal_lahir);
      formdata.append("sekolah", data.sekolah);
      formdata.append("no_jersey", data.no_jersey);
      formdata.append("foto_siswa", data.foto_siswa[0]);
      await api_service.post(`/siswa/add`, formdata);
      getData(page);
      reset();
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
                  Tambah siswa
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label={"no_induk_ss"}
                    register={register}
                    errors={errors}
                  />
                  <Input label={"nama"} register={register} errors={errors} />
                  <Input
                    label={"tempat_lahir"}
                    register={register}
                    errors={errors}
                  />
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"ku_genap"}
                      className="capitalize text-sm font-medium"
                    >
                      Kelompok umur
                    </label>
                    <select
                      {...register("ku_genap")}
                      className="outline-none w-full text-sm py-1.5 px-2 rounded-md appearance-none"
                    >
                      {options.map((v, j) => (
                        <option key={j} className="text-sm" value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"nama_orangtua"}
                      className="capitalize text-sm font-medium"
                    >
                      nama orangtua
                    </label>
                    <Combobox
                      value={selected?.nama_ayah}
                      onChange={setSelected}
                    >
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
                  </div>
                  <div className="grid gap-y-2 mt-2">
                    <label
                      htmlFor={"jenis_kelamin"}
                      className="capitalize text-sm font-medium"
                    >
                      Jenis kelamin
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center mb-4">
                        <input
                          {...register("jenis_kelamin")}
                          type="radio"
                          value="laki-laki"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                        />
                        <label className="ml-2 text-xs">Laki laki</label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          {...register("jenis_kelamin")}
                          type="radio"
                          value="perempuan"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                        />
                        <label className="ml-2 text-xs">Perempuan</label>
                      </div>
                    </div>
                  </div>
                  <Input
                    label={"tanggal_lahir"}
                    type={"date"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"sekolah"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"no_jersey"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"foto_siswa"}
                    register={register}
                    errors={errors}
                    type={"file"}
                  />
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
