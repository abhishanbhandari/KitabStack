import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api
      .get(`/books/${id}/`)
      .then((response) => {
        setBook(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="book-detail">
        {book.cover_image && (
            <img src={book.cover_image} alt={book.title} className="cover-image" />
        )}
        <h2>{book.title}</h2>
        <p>Author: {book.author}</p>
        <p>Categories: {book.categories.join(', ')}</p>
        {book.pdf_file && (
            <a href={book.pdf_file} target="_blank" rel="noreferrer">
                View PDF
            </a>
        )}
    </div>
);
}

export default BookDetail;
