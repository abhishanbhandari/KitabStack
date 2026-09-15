import {Link} from 'react-router-dom';

function Navbar (){
    return (
      <nav className="navbar">
        <span className="logo">📚 Kitab Stack</span>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/books">Books</Link>
        </div>
      </nav>
    );
}

export default Navbar;