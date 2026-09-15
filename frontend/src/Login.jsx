import { useState } from 'react';
import api from './api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/token/', {username, password});
            localStorage.setItem ('access', response.data.access);
            alert ('Login Successful!');
        } catch(err) {
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input type="text" 
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password"
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>
        </form>
    );
}

export default Login;