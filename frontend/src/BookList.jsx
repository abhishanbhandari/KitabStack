import { useState, useEffect } from "react";
import api from "./api";
import { Link } from 'react-router-dom'

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api
      .get("/books/")
      .then((response) => {
        setBooks(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="book-list">
      <h2>Books</h2>
      {books.map((book) => (
        <Link key={book.id} to={`/books/${book.id}`} className="book-card">
          <h3>{book.title}</h3>
        </Link>
      ))}
    </div>
  );
}

export default BookList;
