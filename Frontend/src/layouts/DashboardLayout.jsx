import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
   return (
      <div className="flex">

         <Sidebar />

         <div className="flex-1">
            <Navbar />
            <Outlet />
         </div>

      </div>
   );
};