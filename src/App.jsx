
import './App.css'
import AddOrders from './components/AddOrders'
import EraseOrder from './components/EraseOrder'
import ProductsComponent from './components/ProductsComponent'

function App() {
 
  return (<>
    <AddOrders></AddOrders> 
    <ProductsComponent key="prod" ></ProductsComponent>
    <EraseOrder></EraseOrder>
    </>
  )
}


export default App
