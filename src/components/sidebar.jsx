"use client";
import { Add, ClipboardText, Home2, People, Profile } from "iconsax-react";
import Image from "next/image";
import logo from "../assets/SS-LOGO.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ open,setOpen }) {
  return (
    <nav
      className={`bg-white fixed h-full w-80 text-sm p-6 duration-150 lg:translate-x-0 ${
        open ? "translate-x-0 z-50" : "md:-translate-x-80 -translate-x-80"
      }`}
    >
      <div className="flex justify-between items-start">
        <Image
          src={logo}
          alt="Satria Siliwangi"
          height={120}
          className="mb-5"
          priority
        />
        <button onClick={()=>setOpen(close)} className="hover:bg-gray-200 p-2 rounded-full lg:hidden">
          <Add className="rotate-45" />
        </button>
      </div>
      <Menu title={"dashboard"} route={"/"} Icon={Home2} />
      <Menu title={"orang tua"} route={"/orang-tua"} Icon={People} />
      <Menu title={"siswa"} route={"/siswa"} Icon={Profile} />
      <Menu title={"absensi"} route={"/absensi"} Icon={ClipboardText} />
    </nav>
  );
}

function Menu({ title, route, Icon }) {
  const path = usePathname();
  return (
    <Link
      href={route}
      className={`flex space-x-2 capitalize px-2 py-3 ${
        path === route && "font-semibold bg-[#F0F0F0] rounded-md"
      }`}
    >
      <Icon variant={path === route ? "Bold" : "Linear"} /> <p>{title}</p>{" "}
    </Link>
  );
}
