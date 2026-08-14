import { Navigate } from "react-router-dom";


function ProtectedRoute({ children, allowedRoles }) {

  // =========================
  // CHECK LOGIN
  // =========================

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");


  if (!token || !storedUser) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================
  // READ USER
  // =========================

  let user;

  try {

    user = JSON.parse(storedUser);

  } catch {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================
  // CHECK ROLE
  // =========================

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {


    // ADMIN
    if (user.role === "ADMIN") {

      return (
        <Navigate
          to="/admin"
          replace
        />
      );

    }


    // STORE OWNER
    if (user.role === "STORE_OWNER") {

      return (
        <Navigate
          to="/owner"
          replace
        />
      );

    }


    // NORMAL USER
    if (user.role === "USER") {

      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );

    }


    // UNKNOWN ROLE
    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================
  // AUTHORIZED
  // =========================

  return children;

}


export default ProtectedRoute;