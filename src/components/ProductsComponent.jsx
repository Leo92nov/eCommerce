import { useState } from "react";
import { getProducts } from "../firebase/firebase"
import { useEffect } from "react";

export default function ProductsComponent() {

    const [productos, setProductos] = useState([])

    useEffect(() => {
        getProducts().then(prod => setProductos(prod))
    }, [])




    return <>

        {productos.map((prod) =>
        (<section className="h-80 w-50">

            <img className="w-50 h-50 my-4" src={prod.image} alt="" />

            <h2 className="text-white text-xl" key={prod.id}>
                {prod.title}
            </h2>

            <p>${prod.price}</p>

            <p>{prod.description}</p>
            <div className="h-40">asdasd</div>
        </section>
        ))}

    </>
}