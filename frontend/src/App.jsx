import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import BookList from "./BookList";
import BookDetail from './BookDetail';
import AddBook from "./AddBook";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/add-book" element={<AddBook />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
