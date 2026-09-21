import {Link} from 'react-router-dom';

function Navbar (){
    return (
      <nav className="navbar">
        <Link to="/" className="logo">
          📚 Kitab Stack
        </Link>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/books">Books</Link>
          <Link to="/add-book">Add Book</Link>
        </div>
      </nav>
    );
}

export default Navbar;