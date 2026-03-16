
import './App.css'
import CarritoComponent from './components/CarritoComponent'
import Cart from './components/cart'
import ProductsComponent from './components/ProductsComponent'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
 
  return (<>
    <BrowserRouter>
    <Cart ></Cart>
    <Routes>
    <Route exact path='/' element={<ProductsComponent/>}></Route>
    <Route exact path='/CarritoComponent' element={<CarritoComponent/>}></Route>
    </Routes>
    </BrowserRouter>

    </>
  )
}


export default App
