import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import './adminAccount.css';

function AdminAccount() 
{
  const [users, setUsers] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getUsersList`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId, username) => {
    try {
      await fetch(`http://localhost:8080/deleteUser?userId=${userId}&username=${username}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
      });

      getUsersList();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <span>{user.username}</span>
            <span className='contribution'>Contributions: {user.contribution}</span>
            <button className="delete-button" onClick={() => deleteUser(user.id, user.username)}>
              Delete User
            </button>
          </li>
        ))}
      </ul>
      <Link to={`/getChannels/${username}`}>Channels</Link>
    </div>
  );
  
  
}

export default AdminAccount;
