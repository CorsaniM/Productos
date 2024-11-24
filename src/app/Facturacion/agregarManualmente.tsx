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
import { api, RouterOutputs } from "~/trpc/react";

interface Producto {
  producto?: RouterOutputs["products"]["get"];
}

interface AgregarManualmenteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  agregarProductos: (productos: {
    id: string;
    name: string;
    cantidad: number;
    precio: number;
  }[]) => void;
}

export default function AgregarManualmente({
  open,
  setOpen,
  agregarProductos,
}: AgregarManualmenteProps) {
  const { data: listaProductos } = api.products.list.useQuery();
  const [productosSeleccionados, setProductosSeleccionados] = useState<any[]>([]);

  const agregarProducto = (producto: Producto) => {
    setProductosSeleccionados((prev) => {
      const existente = prev.find((p) => p.id === producto.producto?.id);
      if (existente) {
        return prev.map((p) =>
          p.id === producto.producto?.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }
      return [
        ...prev,
        {
          id: producto.producto?.id,
          name: producto.producto?.name,
          precio: producto.producto?.price || 0,
          cantidad: 1,
        },
      ];
    });
  };

  const eliminarProducto = (id: string) => {
    setProductosSeleccionados((prev) => prev.filter((producto) => producto.id !== id));
  };

  const aceptarSeleccion = () => {
    agregarProductos(productosSeleccionados);
    setOpen(false);
    setProductosSeleccionados([]);
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
            {/* Tabla de productos disponibles */}
            <div>
              <h3>Productos disponibles</h3>
              <Table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {listaProductos?.length ? (
                    listaProductos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.name}</td>
                        <td>{producto.stock}</td>
                        <td>${producto.price.toFixed(2)}</td>
                        <td>
                          <Button onClick={() => agregarProducto({ producto })}>Agregar</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No hay productos disponibles
                      </td>
                    </tr>
                  )}
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
                    <th>Precio</th>
                    <th>Total</th>
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
                          min={1}
                          value={producto.cantidad}
                          onChange={(e) =>
                            setProductosSeleccionados((prev) =>
                              prev.map((p) =>
                                p.id === producto.id
                                  ? { ...p, cantidad: Math.max(Number(e.target.value), 1) }
                                  : p
                              )
                            )
                          }
                        />
                      </td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>${(producto.cantidad * producto.precio).toFixed(2)}</td>
                      <td>
                        <Button
                          onClick={() => eliminarProducto(producto.id)}
                          variant="destructive"
                        >
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
