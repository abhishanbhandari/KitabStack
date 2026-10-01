import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "./api";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/books/${id}/`);
      navigate("/books");
    } catch (err) {
      console.log(err);
      alert("Failed to delete book.");
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="book-detail">
      {book.cover_image && (
        <img src={book.cover_image} alt={book.title} className="cover-image" />
      )}
      <h2>{book.title}</h2>
      <p>Author: {book.author_name}</p>
      <p>Categories: {(book.category_names || []).join(", ")}</p>
      {book.pdf_file && (
        <a href={book.pdf_file} target="_blank" rel="noreferrer">
          View PDF
        </a>
      )}
      {isLoggedIn && (
        <div className="book-actions">
          <Link to={`/books/${id}/edit`}>Edit</Link>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
