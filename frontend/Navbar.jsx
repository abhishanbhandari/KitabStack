import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <nav className="navbar" key={location.pathname}>
      <Link to="/books" replace className="logo">
        📚 Kitab Stack
      </Link>
      <div className="nav-links">
        <Link to="/books">Books</Link>
        {isLoggedIn ? (
          <>
            <Link to="/add-book">Add Book</Link>
            <Link to="/profile">Profile</Link>
            <button type="button" onClick={handleLogout}>
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
