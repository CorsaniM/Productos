import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function CrearProducto(){

const [open, setOpen] = useState(false)
    return(
       
       <div>

        <Button
        className="m-2 px-4 py-2 text-white disabled:opacity-50 text-lg rounded-full bg-gray-800 border hover:bg-gray-500 hover:text-black"
        onClick={() => setOpen(true)}
        >
        Asignar usuario
      </Button>
          </div>
    )
}