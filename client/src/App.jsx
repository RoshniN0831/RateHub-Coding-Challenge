import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AdminRatings from "./pages/AdminRatings";
import Stores from "./pages/Stores";
import StoreDetails from "./pages/StoreDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={["USER"]}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/stores"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminStores />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/ratings"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminRatings />
    </ProtectedRoute>
  }
/>
<Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/stores"
  element={
    <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
      <Stores />
    </ProtectedRoute>
  }
/>
<Route
  path="/stores/:id"
  element={
    <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
      <StoreDetails />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;