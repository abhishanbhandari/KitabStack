import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/categories/")
      .then((response) => {
        setCategories(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId),
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (coverImage) {
      formData.append("cover_image", coverImage);
    }
    if (pdfFile) {
      formData.append("pdf_file", pdfFile);
    }
    selectedCategories.forEach((categoryId) => {
      formData.append("categories", categoryId);
    });

    try {
      await api.post("/books/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/books");
    } catch (err) {
      console.log(err.response.data);
      setError("Failed to add book. Check all fields and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author ID"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <label>Cover Image</label>
      <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />
      <label>PDF File</label>
      <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
      <div className="category-picker">
        <p>Categories:</p>
        {categories.map((category) => (
          <label key={category.id}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
            {category.name}
          </label>
        ))}
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}

export default AddBook;
