import { useState, useEffect } from "react";
import { getProducts, filterProdsByPrice, filtrado, updateProduct, getCarrito, updateCarrito, deleteCarrito, } from "../firebase/firebase";

export default function ProductsComponent() {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([])
  const [categoriasActivas, setCategoriasActivas] = useState([]);
  const [precioMax, setPrecio] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [alCarro, setAlCarro] = useState([]);
  const [condicion, setCondicion] = useState([])

  const handleasd = () => {
    stockUpdate()
  }

  useEffect(() => {
  getProducts().then((prod) => {
    setProductos(prod);
    setProductosOriginales(prod);
  });
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
      id: productoSenalado.id,
      title: productoSenalado.title,
      price: productoSenalado.price,
      image: productoSenalado.image,
      cantidad: Number(cantidades[key])
    }

    /* CREA UN NUEVO OPBJETO PARA EMPUJAR AL CARRITO */


    const productoYaAgregado = carrito.items.find((p) => p.title === nuevoProducto.title)
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

  const handleWipeCarrito = () => {
    deleteCarrito([])
    alCarro.length = 0
  }

  const handleOnChange = (e) => {

    const checked = e.target.checked
    const category = e.target.value

    let nuevasCategorias
    
    if (checked) {
      nuevasCategorias = [...categoriasActivas, category]
     
    }else{
      nuevasCategorias = categoriasActivas.filter((cat) => cat !== category)
    }

    setCategoriasActivas(nuevasCategorias)
    if (nuevasCategorias.length === 0) {
    setProductos(productosOriginales);
    } else {
    const filtrados = productosOriginales.filter((p) =>
      nuevasCategorias.includes(p.Categoria)
    );

    setProductos(filtrados);
  }

  }

  const handleOnChangeNU = (e) => {
    const checked = e.target.checked
    const condition = e.target.value
    let nuevasCondicion
    

    if(checked){
      nuevasCondicion = [...condicion, condition]
    }else{
      nuevasCondicion = condicion.filter((c) => c !== condition)
    }

    setCondicion(nuevasCondicion)
    if (nuevasCondicion.length === 0) {
    setProductos(productosOriginales);
    } else {
    const filtrados = productosOriginales.filter((p) =>
      nuevasCondicion.includes(p.condition)
    );

    setProductos(filtrados);
  }
  }

  return (

    <main className="flex">
      <aside className="border w-60">
        <h2 className="pt-4 text-center text-xl">Filtrar por precio Max</h2>
        <div className=" px-8 pt-2 flex justify-between">
          <input
            type="number"
            placeholder="Precio Max"
            value={precioMax}
            onChange={(e) => setPrecio(e.target.value)}
            className="border w-25" />
          <button className="border p-1 rounded-lg" onClick={handleClick}>
            Filtrar
          </button>
        </div>
        <div className="my-8 border"></div>

        <section>
          <h2 className="text-xl text-center pb-4">Categorías</h2>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Perifericos" checked={categoriasActivas.includes("Perifericos")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Periféricos</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Motherboards" checked={categoriasActivas.includes("Motherboards")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Motherboards</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Microprocesadores" checked={categoriasActivas.includes("Microprocesadores")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Microprocesadores</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Videos" checked={categoriasActivas.includes("Videos")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Placas de Videos</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Refrigeracion" checked={categoriasActivas.includes("Refrigeracion")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Refrigeración</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Almacenamiento" checked={categoriasActivas.includes("Almacenamiento")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Almacenamiento</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="RAM" checked={categoriasActivas.includes("RAM")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Memorias RAM</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="Gabinetes" checked={categoriasActivas.includes("Gabinetes")} onChange={handleOnChange} className="cursor-pointer" />
            <h3 className="pl-4">Gabinetes</h3>
          </div>
        </section>

        <div className="my-8 border"></div>

        <section>
          <h2 className="text-xl text-center pb-4">Condición</h2>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="new" checked={condicion.includes("new")} onChange={handleOnChangeNU} className="cursor-pointer" />
            <h3 className="pl-4">Nuevo</h3>
          </div>
          <div className="flex justify-start px-8 pt-2">
            <input type="checkbox" value="used" checked={condicion.includes("used")} onChange={handleOnChangeNU} className="cursor-pointer" />
            <h3 className="pl-4">Usado</h3>
          </div>
        </section>
      </aside>




      <section className="flex flex-wrap justify-between w-[70%] mx-auto gap-6 bg-red-100">
        {productos.map((prod) => {
          const id = String(prod.id);
          const cant = Number(cantidades[id] ?? 0);
          const stock = Number(prod.stock ?? 0);

          return (
            <main

              key={id}
              className="w-60 h-auto bg-blue-100 flex justify-center items-start">

              <div className="w-50 h-auto flex flex-col items-center">
                <img className="w-50 h-50" src={prod.image} alt="" />

                <h2 className="text-black text-xl text-center">{prod.title}</h2>

                <p className="text-center py-4">${prod.price}</p>

                <p className="line-clamp-3">{prod.description}</p>

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
                <button onClick={handleasd} className="border rounded-xl p-1 mt-4">SnapStock</button>

              </div>
            </main>
          );
        })}
      </section>
    </main>
  );
}