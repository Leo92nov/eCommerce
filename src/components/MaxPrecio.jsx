import { useState, useEffect, useActionState } from "react"
import { getProducts, filterProdsByPrice } from "../firebase/firebase"

export default function MaxPrecio() {

    const [precioMax, setPrecio] = useState("")
    const [productos, setProductos] = useState("")

    useEffect(() => {
        getProducts().then(prod => setProductos(prod))
    }, [])


    const handleClick = () => {
        if (precioMax === "") {
            getProducts().then((prod) => setProductos(prod));
            return;
        }

        const max = Number(precioMax)
        filterProdsByPrice(max).then((prod) => setProductos(prod))
    }



    return <>
        <div>
            <input type="number"
                value={precioMax}
                onChange={(e) => setPrecio(e.target.value)}
                className="border" />

            <button onClick={handleClick}>Filtrar</button>
        </div>



    </>
}