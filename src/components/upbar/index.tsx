"use client";
import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCheckRole } from "~/lib/react/roles";

export default function Upbar() {
  const { user } = useUser();
  const isAdmin = useCheckRole("Admin");
  if (isAdmin.hasRole === null) {
    return <div className="flex w-screen h-16 drop-shadow-xl bg-gray-800 justify-between items-center p-5 font-semibold">Loading...</div>;
  }

  return (
    <div className="flex w-screen h-16 drop-shadow-xl bg-gray-800 justify-between items-center p-5 font-semibold">
      <div className="text-lg">
        {isAdmin.hasRole ? (
          <Link href={"/"}>Administrador {user?.fullName}</Link>
        ) : (
          <Link href={"/"}>No bienvenido</Link>
        )}
      </div>
      <div className="flex items-center p-4 shadow-inner">
        <div className="bg-gray-500 text-slate-100 m-2 rounded shadow-lg">
          <OrganizationSwitcher hidePersonal={true} />
        </div>
        <UserButton />
      </div>
    </div>
  );
}