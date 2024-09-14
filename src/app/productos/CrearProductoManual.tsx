"use client"
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AccordionContent, AccordionItem } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function CrearProducto(){

const {mutateAsync: createProduct, isPending} = api.products.create.useMutation()

const [open, setOpen] = useState(false)
const [name, setName] = useState("")
const [price, setPrice] = useState("0")
const [stock, setStock] = useState("0")
const [barcode, setBarcode] = useState("")
const router = useRouter()

async function handleCreate() {


if(name === "" || price === "0" || stock === "0"){
    return toast.error("Ingrese todos los datos")
} 
await createProduct({
    barcode: barcode,
    name,
    price: Number(price),
    stock: Number(stock),
})
toast.success("Producto creado correctamente");
router.refresh()
setOpen(false)
}


    return(
       

       <div>

        <Button
        className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
        onClick={() => setOpen(true)}
        >
        Crear producto manualmente
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Asignar usuarios a Esta</DialogTitle>
          </DialogHeader>
          
              <Card className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Label htmlFor="name">Nombre</Label>
         
          <Input
                      id="name"
                       placeholder="ej: coca cola 600ml"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Label htmlFor="name">Precio $</Label>

          <Input
                      id="name"
                       placeholder="ej: $10.00"
                      value={price}
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                    />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Label htmlFor="name">Cantidad en stock</Label>
          <Input
                      id="name"
                      value={stock}
                      placeholder="100"

                      type="number"
                      min={0}
                      onChange={(e) => setStock(e.target.value)}
                    />
              </div>
              <Label htmlFor="name">Codigo de barras</Label>
          <div>    
          <Input
                      id="name"
                      value={barcode}
                      placeholder="100"

                      type="number"
                      onChange={(e) => setBarcode(e.target.value)}
                    />
              </div>
          </Card>
              <DialogFooter>
            <Button disabled={isPending} onClick={handleCreate}>
              {isPending && (
                <Loader2Icon className="mr-2 animate-spin" size={20} />
              )}
              Agregar producto
            </Button>
            <Button disabled={isPending} onClick={()=>setOpen(false)}>
              
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </div>
    )
}