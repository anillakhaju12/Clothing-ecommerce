import { Outlet } from "react-router-dom"
import ShoppingHeader from "./header.jsx";


function ShoppingLayout(){
  return(
    <div>
      <h1>This is shoping Layout</h1>
      <ShoppingHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default ShoppingLayout;