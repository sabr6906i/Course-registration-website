import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import MyRegistrations from "./pages/MyRegistrations";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_staff") === "true";

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Logged-in users only */}
        <Route
          path="/my-registrations"
          element={token ? <MyRegistrations /> : <Navigate to="/login" />}
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
