import { useState } from 'react';
import api from './api'

function Register () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState ('');
    const [error, setError] = useState ('');
    const [success, setSuccess] = useState ('');

    const handleSubmit = async (e) => {
        e.preventDefault ();
        try {
          await api.post("/register/", { username, password });
          setSuccess("Account created! You can now log in.");
          setError("");
        } catch (err) {
          setError("Registration failed. Try a different username.");
          setSuccess("");
        }
    };


    return (
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "#1db954" }}>{success}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    );
}

export default Register;