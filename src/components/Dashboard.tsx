import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material Icons
import ShieldIcon from '@mui/icons-material/Shield';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
// Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://usermanagementbackend-lake.vercel.app/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (error) {
        navigate('/');
      }
    };
    fetchUsers();
  }, [navigate]);

  // Redirect to login if all users are blocked
  useEffect(() => {
    if (users.length > 0 && users.every(user => user.status === 'blocked')) {
      toast.warning('All users are blocked. Redirecting to login...');
      setTimeout(() => {
        localStorage.removeItem('token'); 
        navigate('/');
      }, 2000);
    }
  }, [users, navigate]);

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? users.map(user => user._id) : []);
  };

  // Handle individual selection
  const handleSelection = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  // Handle block users
  const handleBlock = async () => {
    try {
      await axios.post('https://usermanagementbackend-lake.vercel.app/api/users/block', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(user => selected.includes(user._id) ? { ...user, status: 'blocked' } : user));
      toast.success('Users blocked successfully');
    } catch (error) {
      toast.error('Error blocking users');
    }
  };

  // Handle unblock users
  const handleUnblock = async () => {
    try {
      await axios.post('https://usermanagementbackend-lake.vercel.app/api/users/unblock', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(user => selected.includes(user._id) ? { ...user, status: 'active' } : user));
      toast.success('Users unblocked successfully');
    } catch (error) {
      toast.error('Error unblocking users');
    }
  };

  // Handle delete users
  const handleDelete = async () => {
    try {
      await axios.post('https://usermanagementbackend-lake.vercel.app/api/users/delete', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(user => !selected.includes(user._id)));
      toast.success('Users deleted successfully');
    } catch (error) {
      toast.error('Error deleting users');
    }
  };
// Handle logout and remove token from local storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0"><ShieldIcon /> User Management</h3>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="btn-group">
              <button className="btn btn-danger" onClick={handleBlock} title="Block selected users">
                <BlockIcon /> Block
              </button>
              <button className="btn btn-success" onClick={handleUnblock} title="Unblock selected users">
                <LockOpenIcon /> Unblock
              </button>
              <button className="btn btn-warning" onClick={handleDelete} title="Delete selected users">
                <DeleteIcon /> Delete
              </button>
            </div>
            <span className="badge bg-secondary">{selected.length} Selected</span>

            <button className="btn btn-secondary" onClick={handleLogout} title="Logout">
              <LogoutIcon /> Logout
            </button>
          </div>

          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={selected.includes(user._id) ? 'table-warning' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
                      onChange={() => handleSelection(user._id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.lastLoginTime || null)}</td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-danger">
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;