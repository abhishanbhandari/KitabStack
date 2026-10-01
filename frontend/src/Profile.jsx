import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Profile() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/profile/")
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((err) => {
        console.log(err);
        setError("Could not load profile. Please log in.");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {username && <p>Logged in as {username}</p>}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </form>
  );
}

export default Profile;
