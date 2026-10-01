import "./App.css";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import BookList from "./BookList";
import BookDetail from "./BookDetail";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<BookList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
