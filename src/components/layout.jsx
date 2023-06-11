"use client";
import { useEffect, useState } from "react";
import SideBar from "./sidebar";
import { HambergerMenu } from "iconsax-react";
import { useRouter } from "next/navigation";

export default function Layout({ children, name, extra }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    document.title = `${name} - Satria Siliwangi Basketball`;
    const abortController = new AbortController();
    return () => {
      abortController.abort();
    };
  }, []);
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("token")) return router.replace("/login");
  }
  return (
    <main className="flex">
      <SideBar open={open} setOpen={setOpen} />
      <section className="lg:pr-6 lg:pl-[22rem] lg:px-10 px-5 w-full py-3 lg:py-0">
        <div className="flex justify-between bg-[#F5F4F7] bg-opacity-20 backdrop-blur-lg fixed w-[88%] lg:w-[55rem] py-5 px-3 rounded-xl items-center">
          <h1 className="font-semibold capitalize lg:text-4xl text-2xl">
            {name}
          </h1>
          <div className="flex items-center">
            <div>{extra}</div>
            <button
              onClick={() => setOpen(!open)}
              className="hover:bg-gray-200 p-2 rounded-full lg:hidden"
            >
              <HambergerMenu size={20} />
            </button>
          </div>
        </div>
        <div className="lg:py-20 py-24 w-full">{children}</div>
      </section>
    </main>
  );
}
