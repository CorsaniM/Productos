"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Title } from "~/components/ui/title";
import { api } from "~/trpc/react";
import CrearProducto from "./CrearProductoManual";
import Link from "next/link";
import LayoutContainer from "~/components/layout-container";
import { GoBackArrow } from "~/components/goback-button";
import CrearCategoria from "./CrearCategorias";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Productos() {
  const { data: precios, isLoading } = api.products.list.useQuery();

  return (
    <LayoutContainer>
      <GoBackArrow />
      <Title> Productos</Title>
      <div className="flex gap-2 mb-4">
      <Button
        variant={"default"}
        onClick={() => window.location.href = "/productos/barcode"}
        >
          Crear por código de barras
        </Button>
        <CrearProducto producto={null}/>
        <CrearCategoria />
      </div>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : precios && precios.length > 0 ? (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {precios.map((precio) => (
              <TableRow key={precio.id}>
                <TableCell>{precio.id}</TableCell>
                <TableCell>{precio.name}</TableCell>
                <TableCell>${precio.price}</TableCell>
                <TableCell>{precio.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant={"link"} onClick={() => window.location.href = `/productos/${precio.id}`} className="text-blue-500 hover:underline hover:text-blue-600 hover-bg-transparent bg-transparent border border-black">
                      Ir al producto
                    </Button>
                    <CrearProducto producto={precio}/>
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => alert(`Eliminar producto con ID: ${precio.id}`)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>No existen precios asociados</h1>
      )}
    </LayoutContainer>
  );
}
