import { useState, useEffect } from "react";
import { getProducts, filterProdsByPrice, updateProduct, getCarrito, updateCarrito, deleteCarrito, carritoExtension } from "../firebase/firebase";

export default function ProductsComponent() {
  const [productos, setProductos] = useState([]);
  const [precioMax, setPrecio] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [alCarro, setAlCarro] = useState([])

  useEffect(() => {
    getProducts().then((prod) => setProductos(prod));
  }, []);

  useEffect(() => {
    console.log("carrito actualizado ", alCarro);

  }, [alCarro]);

  useEffect(() => {
  getCarrito().then((carrito) => {
    setAlCarro(carrito?.items || []);
  });
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

  const handleAgregarAlCarro = async (id) => {

    const key = String(id)
    /* RECONOCE QUE PODRUCTO ESTAS CLICKEANDO */


    const carrito = await getCarrito()
    console.log(carrito);
    /* TRAE EL CARRITO VACIO DE FIREBASE */


    const productoSenalado = productos.find(p => p.id == key)
    /* BUSCA EL PRODUCTO QUE SE ESTA CLICKEANDO POR MATCH DE ID */
    console.log(productoSenalado);
    

    /* ARMA NUEVO CARRO */


    const nuevoProducto = {
      title: productoSenalado.title,
      price: productoSenalado.price,
      cantidad: Number(cantidades[key])
    }
    
    /* CREA UN NUEVO OPBJETO PARA EMPUJAR AL CARRITO */


    const productoYaAgregado = alCarro.find((p) => p.title === nuevoProducto.title)
    /* SI NUEVOPRODUCTO.TITLE ES IGUAL A OBJETO DENTRO DE CARRITO.TITLE, SE SUMA LA CANTIDAD DE UNO Y otro */

    let nuevoCarrito

    if (productoYaAgregado) {
      nuevoCarrito = alCarro.map((p) =>
        p.title === nuevoProducto.title
      ? { ...p, cantidad: p.cantidad + nuevoProducto.cantidad }
      : p
    );
  } else {
    nuevoCarrito = [...alCarro, nuevoProducto]
  }
  
  
    setAlCarro(nuevoCarrito) 
    
    
    await updateCarrito(nuevoCarrito)
    
  }

  const handleWipeCarrito = () =>{
      deleteCarrito([])
  }



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
              className="w-60 h-auto bg-blue-100 flex justify-center items-start">

              <div className="w-50 h-auto flex flex-col items-center">
                <img className="w-50 h-50" src={prod.image} alt="" />

                <h2 className="text-black text-xl text-center">{prod.title}</h2>

                <p className="text-center py-4">${prod.price}</p>

                <p className="line-clamp-4">{prod.description}</p>

                <p className="my-4">Stock actual: {prod.stock}</p>

                <button onClick={hadleUpdate} id={id} className="mt-4 border">
                  Actualizar producto
                </button>

                <div className="flex justify-around w-[70%] mt-4 bg-red-100">
                  <button
                    onClick={() => handleDisminucion(id)}
                    disabled={cant === 0}
                    className="text-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
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

                <button disabled={cant === 0} onClick={() => handleAgregarAlCarro(id)} className="disabled:hover:scale-100 disabled:opacity-40 disabled:cursor-not-allowed mt-6 border rounded-xl p-1 hover:scale-105 hover:transition-transform hover:duration-400 cursor-pointer">Agregar al Carrito</button>

                <button onClick={handleWipeCarrito} className="border rounded-xl p-1 mt-4">Limpiar carrito</button>

              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}