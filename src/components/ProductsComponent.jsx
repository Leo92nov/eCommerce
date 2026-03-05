import { useState, useEffect } from "react";
import { getProducts, filterProdsByPrice, updateProduct } from "../firebase/firebase";

export default function ProductsComponent() {
  const [productos, setProductos] = useState([]);
  const [precioMax, setPrecio] = useState("");
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    getProducts().then((prod) => setProductos(prod));
  }, []);

  const handleClick = () => {
    if (precioMax === "") {
      getProducts().then((prod) => setProductos(prod));
      return;
    }

    const max = Number(precioMax);
    filterProdsByPrice(max).then((prod) => setProductos(prod));
  };

  const hadleUpdate = async (event) => {
    await updateProduct(event.target.id, { price: 180 });
    getProducts().then((prod) => setProductos(prod));
  };

  const handleAumento = (id, stock) => {
    const key = String(id);
    const max = Number(stock ?? Infinity);

    setCantidades((prev) => {
      const actual = Number(prev[key] ?? 0);
      if (actual >= max) return prev;
      return { ...prev, [key]: actual + 1 };
    });
  };

  const handleDisminucion = (id) => {
    const key = String(id);

    setCantidades((prev) => {
      const actual = Number(prev[key] ?? 0);
      if (actual <= 0) return prev;
      return { ...prev, [key]: actual - 1 };
    });
  };

  return (
    <div>
      <input
        type="number"
        value={precioMax}
        onChange={(e) => setPrecio(e.target.value)}
        className="border"
      />

      <button onClick={handleClick}>Filtrar</button>

      <section className="flex flex-wrap justify-between w-[70%] mx-auto gap-6 bg-red-100">
        {productos.map((prod) => {
          const id = String(prod.id);
          const cant = Number(cantidades[id] ?? 0);
          const stock = Number(prod.stock ?? 0);

          return (
            <section
              key={id}
              className="w-60 h-auto bg-blue-100 flex justify-center items-start"
            >
              <div className="w-50 h-auto flex flex-col items-center">
                <img className="w-50 h-50" src={prod.image} alt="" />

                <h2 className="text-black text-xl text-center">{prod.title}</h2>

                <p className="text-center py-4">${prod.price}</p>

                <p>{prod.description}</p>

                <p className="my-4">Stock actual: {prod.stock}</p>

                <button onClick={hadleUpdate} id={id} className="mt-4 border">
                  Actualizar producto
                </button>

                <div className="flex justify-around w-[70%] mt-4 bg-red-100">
                  <button
                    onClick={() => handleDisminucion(id)}
                    disabled={cant === 0}
                    className="text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={cant}
                    readOnly
                    className="border w-16 text-center appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                  />

                  <button
                    onClick={() => handleAumento(id, stock)}
                    disabled={cant >= stock}
                    className="text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}