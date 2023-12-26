import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login ({ setAuthenticated }) 
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8080/getUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      // Successful login
      setAuthenticated();
      navigate(`/getChannels/${data}`);
      alert('Login successful');
    } else {
      // Failed login
      alert('Invalid username or password. Please try again.');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
    <div className="introduction">
        <h2>TechOverflow</h2>
        <p>Your one-stop solution for all your tech problems</p>
    </div>
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <div className="link">
          New to TechOverflow? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
