import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getAllPages } from "./api";

const PAGE_SIZE = 5;

function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllPages("/authors/"), getAllPages("/categories/")])
      .then(([authorItems, categoryItems]) => {
        setAuthors(authorItems);
        setCategories(categoryItems);
      })
      .catch(() => setError("Could not load filters."));
  }, []);

  useEffect(() => {
    const params = { page };
    if (search) params.search = search;
    if (author) params.author = author;
    if (category) params.categories = category;

    setIsLoading(true);
    setError("");
    api.get("/books/", { params })
      .then((response) => {
        setBooks(response.data.results);
        setTotalBooks(response.data.count);
      })
      .catch(() => setError("Could not load books. Please try again."))
      .finally(() => setIsLoading(false));
  }, [search, author, category, page]);

  const resetPage = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <section className="book-list">
      <div className="section-heading"><div><p className="eyebrow">Library</p><h1>Discover books</h1></div><span>{totalBooks} books</span></div>
      <div className="filters">
        <input type="search" placeholder="Search titles, authors, or categories" value={search} onChange={resetPage(setSearch)} />
        <select value={author} onChange={resetPage(setAuthor)} aria-label="Filter by author"><option value="">All authors</option>{authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select value={category} onChange={resetPage(setCategory)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      </div>
      {isLoading && <p className="status">Loading books...</p>}
      {error && <p className="form-message error">{error}</p>}
      {!isLoading && !error && books.length === 0 && <p className="status">No books match those filters.</p>}
      <div className="book-grid">
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="book-card">
            {book.cover_image ? <img src={book.cover_image} alt="" /> : <div className="cover-placeholder">Book</div>}
            <div><h2>{book.title}</h2><p>{book.author_name}</p><p>{(book.category_names || []).join(" · ")}</p></div>
          </Link>
        ))}
      </div>
      {totalBooks > PAGE_SIZE && <div className="pagination"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {Math.ceil(totalBooks / PAGE_SIZE)}</span><button type="button" disabled={page * PAGE_SIZE >= totalBooks} onClick={() => setPage((current) => current + 1)}>Next</button></div>}
    </section>
  );
}

export default BookList;
