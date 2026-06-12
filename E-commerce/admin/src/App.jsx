import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin/Admin";
import Login from "./pages/Login";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("admin-token") || "");

  if (token === "") {
    return <Login setToken={setToken} />;
  }

  return (
    <div>
      <Navbar setToken={setToken} />
      <Admin />
    </div>
  );
};

export default App;