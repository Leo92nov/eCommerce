import { getOrders } from "../firebase/firebase"

export default function EraseOrder(){

const handleClick = () =>{

    getOrders()

}

    return <>
    
    <button onClick={handleClick} className="border my-8">Pagar Orden</button>
    
    </>
}