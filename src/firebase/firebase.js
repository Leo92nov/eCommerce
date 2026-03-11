// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnqHhTtBF4l1cfZDQOdmJjSjKevWpSHYM",
  authDomain: "ecommercecurso-f5da5.firebaseapp.com",
  projectId: "ecommercecurso-f5da5",
  storageBucket: "ecommercecurso-f5da5.firebasestorage.app",
  messagingSenderId: "131342173866",
  appId: "1:131342173866:web:1b096c6be1ba00286072d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export async function getProducts(){
    const response = await getDocs(collection(db, 'products'));
    /* este response es un querysnapshot permite acceder a los docs*/
    const listaProductos = [];
    response.forEach((documento) => listaProductos.push({id: documento.id, ...documento.data()})) /* .data() trae todos los campos del documento */
    return listaProductos;
}

export async function filterProdsByPrice(maxPrice) {
    const q = query(collection(db,"products"), where("price", "<", maxPrice))
    const response = await getDocs(q)
    const listaFiltroPrecio = []
    response.forEach(docu => listaFiltroPrecio.push({id:docu.id, ...docu.data()}))
    return listaFiltroPrecio
}


/* enviar orden de pedido */
export async function addOrder(order){
  const orderCollection = collection(db, "orders")
  const docRef = await addDoc(orderCollection, order)
  console.log(docRef);
  console.log(docRef.id)
  return docRef.id

}

export async function getOrders(){

  const response = await getDocs(collection(db, "orders"))
  const listaOrdenes = []
  response.forEach((ord) => listaOrdenes.push({id:ord.id, ...ord.data()}))
 console.log(listaOrdenes);
 
}

export async function updateProduct(id, toUpdate) {
  const productDoc = doc(db, "products", id)
  
  try{
    await updateDoc(productDoc, toUpdate)
  } catch (error){
    console.log("Error" + error);
    
  }

}
export async function getCarrito() {
const ref = doc(db, "carritos", "N0NghdC6J4bPsduTkTDk")
const response = await getDoc(ref)
  const carrito = response.data()
  return carrito
}

export async function updateCarrito(nuevoCarrito){

  const ref = doc(db, "carritos", "N0NghdC6J4bPsduTkTDk")

  await updateDoc(ref, {
    items: nuevoCarrito
  })

}

export async function deleteCarrito([]){

  const ref = doc(db, "carritos", "N0NghdC6J4bPsduTkTDk")

  await updateDoc(ref, {
    items: {}
  })

}