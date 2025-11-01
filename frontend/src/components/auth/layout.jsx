import { Outlet } from "react-router-dom";



function AuthLayout(){
  return(
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-background flex-1">
        <div className="max-w-md space-y-6 text-center text-pimary  px-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Clothing E-commerce</h1>
        </div>
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </ div>

  )
}


export default AuthLayout;