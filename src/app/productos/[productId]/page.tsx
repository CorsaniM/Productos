"use client"
import ProductPage from "./product"

export default function Page(props:{params:{productId: string}}) {


    const id = props.params.productId 


    
if (id) {
   return(
    <div className="w-full justify-center">
       <ProductPage params={{productId:id}} />
    </div>
   )

}

else {
 return (
    <h1>Este producto no existe o esta registrado</h1>
 )   
}

}