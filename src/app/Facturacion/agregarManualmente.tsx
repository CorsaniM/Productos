"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
  Dialog,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Table } from "~/components/ui/table";
import { api } from "~/trpc/react";

interface AgregarManualmenteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agregarProductos: (productos: any[]) => void; // Recibimos la función para agregar productos
}

export default function AgregarManualmente({
  open,
  setOpen,
  agregarProductos,
}: AgregarManualmenteProps) {


    const {data: listaProductos} = api.products.list.useQuery();
    const [productosSeleccionados, setProductosSeleccionados] = useState<any[]>([]);

  const agregarProducto = (producto: any) => {
    setProductosSeleccionados((prev) =>
      prev.find((p) => p.id === producto.id) ? prev : [...prev, { ...producto, cantidad: 1 }]
    );
  };

  const eliminarProducto = (id: string) => {
    setProductosSeleccionados((prev) => prev.filter((producto) => producto.id !== id));
  };

  const aceptarSeleccion = () => {
    agregarProductos(productosSeleccionados); // Llamamos a la función para agregar los productos a la lista
    setOpen(false); // Cerramos el modal
    setProductosSeleccionados([]); // Limpiamos la selección
  };

  return (
<div>

<Button onClick={() => setOpen(true)}>Agregar producto manualmente</Button>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Agregar productos</DialogTitle>
        </DialogHeader>

        <Card className="p-5 space-y-5">
          {/* Tabla de productos disponibles (suponiendo que ya tienes la lista de productos en `listaProductos`) */}
          <div>
            <h3>Productos disponibles</h3>
            <Table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {/* Aquí iría tu lista de productos */}
                {listaProductos ? listaProductos.map((producto) => (
                    <tr key={producto.id}>
                    <td>{producto.name}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.categoriesId}</td>
                    <td>
                      <Button onClick={() => agregarProducto(producto)}>Agregar</Button>
                    </td>
                  </tr>
                )) : <h1>No hay productos disponibles</h1>}
              </tbody>
            </Table>
          </div>

          {/* Tabla de productos seleccionados */}
          <div>
            <h3>Productos seleccionados</h3>
            <Table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((producto) => (
                    <tr key={producto.id}>
                    <td>{producto.name}</td>
                    <td>
                      <Input
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) =>
                            setProductosSeleccionados((prev) =>
                            prev.map((p) =>
                                p.id === producto.id
                        ? { ...p, cantidad: Number(e.target.value) }
                        : p
                    )
                )
            }
            />
                    </td>
                    <td>
                      <Button onClick={() => eliminarProducto(producto.id)} variant="destructive">
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <DialogFooter>
          <Button onClick={aceptarSeleccion}>Aceptar</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
                </div>
  );
}
