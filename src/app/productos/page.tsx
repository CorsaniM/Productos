"use client"
import { Button } from "~/components/button";
import { List, ListTile } from "~/components/ui/list";
import { Title } from "~/components/ui/title";
import { api } from "~/trpc/react";
import CrearProducto from "./CrearProductoManual";
import Link from "next/link";
import LayoutContainer from "~/components/layout-container";
import { GoBackArrow } from "~/components/goback-button";
import CrearCategoria from "./CrearCategorias";

export default function Productos(){

    // const {data: precios} = api.products.list.useQuery()


    // async function handleCreate() {



    // }
    return(
        <LayoutContainer>
          <GoBackArrow/>
          <Title>Productos</Title>
            <div className="flex">
              <Link 
              className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
               href="/productos/barcode">Crear por codigo de barras
               </Link>
             <CrearProducto/>
             <CrearCategoria/>
              </div>
             <List>
          {/* {precios ? precios.map((precio) => {
            return (
              <ListTile
                key={precio.id}
                href={`/productos/${precio.id}`}
                title={precio.name}
              />
            );
          }) : (<h1>No existen precios asociados</h1>)} */}
        </List>
        </LayoutContainer>
    )

}