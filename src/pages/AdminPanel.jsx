// AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleBlockUser = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const updatedUser = { ...user, isBlocked: !user.isBlocked };

      await axios.put(`/api/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? updatedUser : u))
      );

      if (userId === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id && updatedUser.isBlocked) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));

      if (userId === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      const updatedUser = { ...user, role: user.role === 'admin' ? 'user' : 'admin' };

      await axios.put(`/api/users/${userId}/admin`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? updatedUser : u))
      );

      if (userId === JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id && updatedUser.role !== 'admin') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error toggling admin privileges:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <p>Manage users in the system.</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button
                  className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-warning'} me-2`}
                  onClick={() => handleBlockUser(user.id)}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button
                  className={`btn btn-sm ${user.role === 'admin' ? 'btn-danger' : 'btn-primary'} me-2`}
                  onClick={() => handleToggleAdmin(user.id)}
                >
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
