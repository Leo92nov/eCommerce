// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {collection, getDocs, getFirestore} from "firebase/firestore";


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