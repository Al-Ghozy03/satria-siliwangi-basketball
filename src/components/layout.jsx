"use client";
import { useEffect } from "react";
import SideBar from "./sidebar";

export default function Layout({ children, name }) {
  useEffect(() => {
    document.title = `${name} - Satria Siliwangi Basketball`;
    const abortController = new AbortController();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <main className="flex">
      <SideBar />
      <section className="py-6 px-10 w-full">
        <header className="font-semibold capitalize text-4xl bg-[#F5F4F7] bg-opacity-20 backdrop-blur-lg fixed w-[55rem] py-5 px-3 rounded-xl">
          {name}
        </header>
        <div className="py-20 w-full">{children}</div>
      </section>
    </main>
  );
}
