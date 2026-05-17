import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("is_staff") === "true";

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // reload so navbar updates
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Course Registration Portal
      </Link>

      <div className="navbar-links">
        <Link to="/">Courses</Link>

        {token && <Link to="/my-registrations">My Registrations</Link>}
        {isAdmin && <Link to="/admin">Admin Dashboard</Link>}

        {token ? (
          <>
            <span style={{ color: "white", fontSize: "14px" }}>Hi, {username}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
