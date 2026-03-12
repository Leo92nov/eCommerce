
import './App.css'
import AddOrders from './components/AddOrders'
import Cart from './components/cart'
import EraseOrder from './components/EraseOrder'
import ProductsComponent from './components/ProductsComponent'

function App() {
 
  return (<>
    <AddOrders></AddOrders> 
    <ProductsComponent key="prod" ></ProductsComponent>
    <EraseOrder></EraseOrder>
    <Cart></Cart>
    </>
  )
}


export default App
