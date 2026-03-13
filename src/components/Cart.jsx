import { useState } from "react"
import { carritoExtension } from "../firebase/firebase"
import { useEffect } from "react"

export default function Cart(){

    const [cantidad, setCantidad] = useState(0)

   useEffect(() => {
        const contar = carritoExtension((num) => {
            setCantidad(num)});
            return () => contar();},
    [])
    

    return <>
    <div className="w-20 h-20 fixed bottom-6 right-6 rounded-full bg-blue-200">
        <section className="h-8 w-8 bg-red-500 rounded-full right-11 fixed text-center text-white"> 
            {cantidad}
        </section>
        <img src="../../Car6.jpg" alt="" />
    </div>
</>
}