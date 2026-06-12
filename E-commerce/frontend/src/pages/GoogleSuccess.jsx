import { useEffect } from "react";

const GoogleSuccess = () => {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("auth-token", token);
      window.location.replace("/");
    } else {
      window.location.replace("/login");
    }
  }, []);

  return <h2>Logging you in...</h2>;
};

export default GoogleSuccess;
