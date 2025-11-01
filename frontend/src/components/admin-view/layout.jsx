import { Outlet } from "react-router-dom"
import AdminHeader from './adminHeader.jsx'
import AdminSidebar from './adminSidebar.jsx'




function AdminLayout() {
  return (
    <div>
      <AdminSidebar />
      <div>
        <AdminHeader/>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout;