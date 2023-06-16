"use client";
import api_service from "@/api/api_service";
import { months } from "@/app/page";
import Layout from "@/components/layout";
import Loading from "@/components/loading";
import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    nama_ayah: yup.string().required(),
    no_telepon_ayah: yup.number().required(),
    nama_ibu: yup.string().required(),
    no_telepon_ibu: yup.number().required(),
    alamat: yup.string().required(),
  })
  .required();

export default function DetailOrangTua() {
  const { id } = useParams();
  const [isOpenSiswa, setIsOpenSiswa] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const [iuran, setIuran] = useState({
    loading: false,
    error: false,
    data: [],
    total: 0,
    total_page: 0,
    current_page: 1,
  });

  const getIuran = async () => {
    try {
      setIuran({
        error: false,
        loading: true,
        data: [],
        total: iuran.total,
        total_page: iuran.total_page,
        current_page: iuran.current_page,
      });
      const res = await api_service.get(
        `/iuran-bulanan?id=${id}&limit=15&page=${page}`
      );
      setIuran({
        error: false,
        loading: false,
        data: res.data,
        total: iuran.total,
        total_page: iuran.total_page,
        current_page: iuran.current_page,
      });
    } catch (er) {
      console.log(er);
      setIuran({
        error: true,
        loading: false,
        data: [],
        total: iuran.total,
        total_page: iuran.total_page,
        current_page: iuran.current_page,
      });
    }
  };
  const getData = async () => {
    try {
      setData({ loading: true, error: false, data: null });
      const res = await api_service.get(`/orangtua/${id}`);
      setData({ loading: false, error: false, data: res.data });
    } catch (er) {
      console.log(er);
      setData({ loading: false, error: true, data: null });
    }
  };
  const changeStatus = async (e, id) => {
    try {
      await api_service.put(`/iuran-bulanan/edit/${id}`, {
        status: e.target.value,
      });
      getIuran();
    } catch (er) {
      console.log(er);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getIuran();
  }, [page]);

  return (
    <Layout
      name={"Orang Tua"}
      extra={
        <button
          onClick={() => setIsOpenEdit(true)}
          className="text-sm bg-[#FFE3B1] px-4 py-1 rounded-md font-semibold text-orange-500"
        >
          Edit
        </button>
      }
    >
      <ModalDetail
        isOpen={isOpenSiswa}
        setIsOpen={setIsOpenSiswa}
        data={selected}
      />
      {data.loading ? (
        <div className="flex justify-center h-96 flex-col items-center">
          <Icon className="h-12 w-12 animate-spin" icon="mdi:loading" />
        </div>
      ) : !data.data ? (
        "Orangtua tidak ditemukan"
      ) : (
        <div>
          <ModalEdit
            getData={getData}
            isOpen={isOpenEdit}
            setIsOpen={setIsOpenEdit}
            data={{
              nama_ayah: data.data?.nama_ayah,
              no_telepon_ayah: data.data?.no_telepon_ayah,
              nama_ibu: data.data?.nama_ibu,
              no_telepon_ibu: data.data?.no_telepon_ibu,
              alamat: data.data?.alamat,
            }}
          />
          <div className="flex space-x-5">
            <Info title={"Nama Ayah"} value={data.data?.nama_ayah} />
            <Info title={"Nama Ibu"} value={data.data?.nama_ibu} />
          </div>
          <Info
            title={"Nama Siswa"}
            setIsOpen={setIsOpenSiswa}
            setSelected={setSelected}
            value={data.data?.siswa}
          />
          <Info title={"Alamat"} value={data.data?.alamat} />
          <h3 className="text-gray-500 text-sm mt-2">Iuran Bulanan</h3>
          <div className="shadow-xl shadow-gray-200 bg-white py-5 px-3 rounded-lg lg:w-1/2 mt-2">
            <table className="table-auto w-full">
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
                {iuran.loading
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
                      </tr>
                    ))
                  : iuran.data?.map((data, i) => {
                      const date = new Date(data.tanggal_pembayaran);
                      return (
                        <tr key={i}>
                          <td className="text-sm">{months[date.getMonth()]}</td>
                          <td className="text-sm">
                            <div
                              className={`${
                                data.status === "terbayar"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } capitalize text-white text-center text-xs rounded-lg py-1.5 w-32`}
                            >
                              {data.status}
                            </div>
                          </td>
                          <td>
                            <select
                              onChange={(e) => changeStatus(e, data.id)}
                              defaultValue={data.status}
                              className="text-sm capitalize h-9 outline-none rounded-md"
                            >
                              <option
                                value="belum terbayar"
                                className="capitalize text-sm"
                              >
                                belum terbayar
                              </option>
                              <option
                                value="terbayar"
                                className="capitalize text-sm"
                              >
                                terbayar
                              </option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Info({ title, value, setIsOpen, setSelected }) {
  return (
    <div className="mt-2">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      {typeof value === "string" && <p className="font-medium">{value}</p>}
      {typeof value === "object" &&
        (value?.length === 0
          ? "Siswa belum terdaftar"
          : value?.map((data, i) => (
              <div key={i} className="font-medium">
                <button
                  onClick={() => {
                    setSelected(data);
                    setIsOpen(true);
                  }}
                >
                  {i + 1}. {data.nama}
                </button>
              </div>
            )))}
    </div>
  );
}

function ModalEdit({ data, isOpen, setIsOpen, getData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await api_service.put(`/orangtua/edit/${id}`, data);
      getData();
      reset();
      setIsOpen(false);
      setIsLoading(false);
    } catch (er) {
      setIsLoading(false);
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
                  Edit Orangtua
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label={"nama_ayah"}
                    register={register}
                    value={data}
                    errors={errors}
                  />
                  <Input
                    label={"no_telepon_ayah"}
                    register={register}
                    value={data}
                    errors={errors}
                  />
                  <Input
                    label={"nama_ibu"}
                    register={register}
                    value={data}
                    errors={errors}
                  />
                  <Input
                    label={"no_telepon_ibu"}
                    register={register}
                    value={data}
                    errors={errors}
                  />
                  <Input
                    label={"alamat"}
                    register={register}
                    value={data}
                    errors={errors}
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
                      {isLoading?<Icon className="animate-spin h-6 w-6" icon="mdi:loading" />:"Submit"}
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

function Input({ label, type, register, value, errors }) {
  return (
    <div className="grid gap-y-2 mt-2">
      <label htmlFor={label} className="capitalize text-sm font-medium">
        {label.replaceAll("_", " ")}
      </label>
      <input
        {...register(label, { value: value[label] })}
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
                  <div
                    style={{
                      backgroundImage: `url(${process.env.BASE_URL}${data?.foto_siswa})`,
                    }}
                    className="h-24 w-24 rounded-full bg-gray-300 bg-cover bg-center"
                  ></div>
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
