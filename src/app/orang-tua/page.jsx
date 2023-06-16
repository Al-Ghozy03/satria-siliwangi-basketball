"use client";
import api_service from "@/api/api_service";
import Layout from "@/components/layout";
import Loading from "@/components/loading";
import { Dialog, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Edit, Trash } from "iconsax-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
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

export default function OrangTua() {
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
      const res = await api_service.get(`/orangtua?limit=15&page=${page}`);
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
      name={"Orang tua"}
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
        <table className="w-full">
          <thead className="border border-b-[1.5px] border-l-0 border-r-0 border-t-0 mb-2">
            <tr>
              <th className="font-semibold text-[#969696] text-sm w-1/4 lg:w-auto">
                No
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-auto">
                Nama Ayah
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-96 lg:w-auto">
                No Hp Ayah
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-full lg:w-auto">
                Nama Ibu
              </th>
              <th className="font-semibold text-[#969696] text-sm text-left w-[96] lg:w-auto">
                No Hp Ibu
              </th>
              <th className="font-semibold text-[#969696] text-sm text-center lg:text-left w-96 lg:w-auto">
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
              : data.data.length === 0
              ? "Empty"
              : data.data?.map((data, i) => (
                  <tr key={i}>
                    <td className="text-sm text-center">{i + 1}</td>
                    <td className="text-sm">
                      {data.nama_ayah ? data.nama_ayah : "-"}
                    </td>
                    <td className="text-sm">
                      {data.no_telepon_ayah ? data.no_telepon_ayah : "-"}
                    </td>
                    <td className="text-sm">
                      {data.nama_ibu ? data.nama_ibu : "-"}
                    </td>
                    <td className="text-sm">
                      {data.no_telepon_ibu ? data.no_telepon_ibu : "-"}
                    </td>
                    <td className="text-sm">
                      <div className="flex space-x-3">
                        <Link
                          href={`/orang-tua/${data.id}`}
                          className="bg-blue-500 rounded-md p-1 text-white text-xs"
                        >
                          {/* <Edit className="h-4 w-4" /> */}Detail
                        </Link>
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
                ))}
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api_service.post(`/orangtua/add`, data);
      getData();
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
                  Create
                </Dialog.Title>
                <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    label={"nama_ayah"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"no_telepon_ayah"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"nama_ibu"}
                    register={register}
                    errors={errors}
                  />
                  <Input
                    label={"no_telepon_ibu"}
                    register={register}
                    errors={errors}
                  />
                  <Input label={"alamat"} register={register} errors={errors} />
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
