import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Addproduct from "../../components/Addproduct";
import ListProduct from "../../components/ListProduct";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Users from "./Users";
import Offers from "./Offers";

const Admin = () => {
  return (
    <div className="mt-20">
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/addproduct" element={<Addproduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

export default Admin;