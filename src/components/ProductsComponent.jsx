import { useState } from "react";
import { getProducts, filterProdsByPrice } from "../firebase/firebase"
import { useEffect } from "react";
import MaxPrecio from "./MaxPrecio";

export default function ProductsComponent() {

    const [productos, setProductos] = useState([])
    const [precioMax, setPrecio] = useState("")

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
            <section className="flex flex-wrap justify-between w-[80%] mx-auto gap-6">
                {productos.map((prod) =>
                (<section key={prod.id} className="w-60 h-auto">
                    <div className="w-50 h-auto flex flex-col bg-blue-100">
                        <img className="w-50 h-50" src={prod.image} alt="" />

                        <h2 className="text-black text-xl text-center">
                            {prod.title}
                        </h2>

                        <p className="text-center py-4">${prod.price}</p>

                        <p>{prod.description}</p>
                        <div className="pt-4">asdasd</div>
                    </div>
                </section>
                ))}
            </section>
        </div>
    </>
}