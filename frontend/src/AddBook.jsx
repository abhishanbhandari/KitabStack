import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAllPages } from "./api";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllPages("/authors/"), getAllPages("/categories/")])
      .then(([authorItems, categoryItems]) => {
        setAuthors(authorItems);
        setCategories(categoryItems);
      })
      .catch(() => setError("Could not load authors and categories."));
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (coverImage) formData.append("cover_image", coverImage);
    if (pdfFile) formData.append("pdf_file", pdfFile);
    selectedCategories.forEach((categoryId) => formData.append("categories", categoryId));

    try {
      await api.post("/books/", formData);
      navigate("/books");
    } catch {
      setError("Failed to add book. Check all fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Book</h2>
      {error && <p className="form-message error">{error}</p>}
      <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <select value={author} onChange={(event) => setAuthor(event.target.value)} required aria-label="Author">
        <option value="">Select an author</option>
        {authors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <label>Cover image <input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files[0])} /></label>
      <label>PDF file <input type="file" accept="application/pdf" onChange={(event) => setPdfFile(event.target.files[0])} /></label>
      <div className="category-picker">
        <p>Categories</p>
        {categories.map((category) => (
          <label key={category.id}>
            <input type="checkbox" checked={selectedCategories.includes(category.id)} onChange={() => toggleCategory(category.id)} />
            {category.name}
          </label>
        ))}
      </div>
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Book"}</button>
    </form>
  );
}

export default AddBook;
