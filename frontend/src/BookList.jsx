import { useState, useEffect } from "react";
import api from "./api";

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
        <div key={book.id} className="book-card">
          <h3>{book.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default BookList;
