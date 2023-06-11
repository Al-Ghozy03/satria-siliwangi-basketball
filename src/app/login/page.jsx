"use client";
import bg from "../../assets/bg.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api_service from "@/api/api_service";
import { useState } from "react";
import { useRouter } from 'next/navigation';


const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [message, setMessage] = useState(null);
  const router = useRouter()
  const onSubmit = async (data) => {
    try {
      const res = await api_service.post("/admin/login", data);
      setMessage(null);
      localStorage.setItem("token",res.data.token)
      router.replace("/")
    } catch (er) {
      console.log(er);
      setMessage(er?.message);
    }
  };

  return (
    <main
      style={{ backgroundImage: `url(${bg.src})` }}
      className="w-full h-screen bg-cover bg-bottom flex items-center"
    >
      <div className="bg-white rounded-xl w-2/6 mx-auto p-5">
        <h1 className="text-center text-xl font-semibold">Welcome</h1>
        <p className="text-gray-500 text-center text-xs">
          Please input your email and password
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {message && (
            <div className="h-8 w-full bg-red-200 rounded flex items-center space-x-3 px-2 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm text-red-500">{message}</p>
            </div>
          )}
          <Input
            label={"Email"}
            name={"email"}
            type={"email"}
            register={register}
            error={errors.email?.message}
          />
          <Input
            label={"Password"}
            name={"password"}
            type={"password"}
            register={register}
            error={errors.password?.message}
          />
          <button className="bg-[#F3A822] text-sm text-white font-semibold w-full py-2 mt-2 rounded-md">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({ label, register, name, type, error }) {
  return (
    <div className="grid gap-y-1.5 mt-2">
      <label className="font-semibold text-sm capitalize" htmlFor={label}>
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className="outline-none h-9 rounded-md border border-gray-400 text-[0.840rem]"
        placeholder={`Enter your ${label}`}
      />
      <small className="text-red-500 italic text-xs">{error}</small>
    </div>
  );
}
