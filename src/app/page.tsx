"use client"
import Link from "next/link";
import LayoutContainer from "~/components/layout-container";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {


  return (
    <LayoutContainer>
      <section className="space-y-2">
      <div className="flex justify-between">
      <h1>Bienvenido</h1>
      <div className="justify-between">
        <Link href="/asignarprecios">Asignar precios</Link>

        <Link href="/productos">Productos</Link>
      </div>
      </div>
      </section>
    </LayoutContainer>
  );
}
