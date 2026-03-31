import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo || userInfo.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;