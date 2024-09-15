"use client"
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccordionContent, AccordionItem } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function CrearProducto(){

const {mutateAsync: createProduct, isPending} = api.products.create.useMutation()
const { mutateAsync: createCategory } = api.categories.create.useMutation();
const {data: categories} = api.categories.list.useQuery()

const [open, setOpen] = useState(false)
const [name, setName] = useState("")
const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories ?? []);

const [price, setPrice] = useState("0")
const [stock, setStock] = useState("0")
const [barcode, setBarcode] = useState("")
const router = useRouter()


const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchValue = e.target.value.toLowerCase();
  const filtered = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchValue)
  );
  setFilteredCategories(filtered ?? []);
  setNewCategory(searchValue)
  console.log(newCategory)
};
async function handleCreate() {
  if (name === "" || price === "0" || stock === "0") {
    return toast.error("Ingrese todos los datos");
  }

  let categoryId = 1; 
  if (!categories?.some(cat => cat.name === newCategory) && category === "") {
   
    const result = await createCategory({
      name: newCategory,
      description: newCategory,
      createdAt: new Date,
      updatedAt: new Date,
    });
    categoryId = result.id;
  } else if (category) {
    const selectedCategory = categories?.find(cat => cat.name === category ?? "");
    if (selectedCategory) {
      categoryId = selectedCategory.id;
    }
  }

  await createProduct({
    barcode,
    name,
    price: Number(price),
    stock: Number(stock),
    categoriesId: categoryId
  });

  toast.success("Producto creado correctamente");
  router.refresh();
  setOpen(false);
}

useEffect(() => {
  if (categories) {
    setFilteredCategories(categories);
    setCategory("");
  }
}, [categories]);


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
              <Label htmlFor="category">Categoria</Label>
              <Label htmlFor="category">Categoría</Label>
            <Input
              id="category-search"
              placeholder="Crear categoría..."
              onChange={handleCategorySearch}
            />
            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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