import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import CreateTemplate from './pages/CreateTemplate';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import SubmitForm from './pages/SubmitForm';
import SearchResults from './pages/SearchResults';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  const { role } = JSON.parse(atob(token.split('.')[1]));
  return role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state
  };

  return (
    <Router>
      {/* Pass the handleSearch function and searchQuery state to Navbar */}
      <Navbar onSearch={handleSearch} />
      <div className="container-fluid mt-4">
        <Routes>
          {/* Pass the searchQuery state to the Home component */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route path="/templates/:id" element={<TemplateDetail />} />
          <Route
            path="/create-template"
            element={
              <ProtectedRoute>
                <CreateTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms/:id"
            element={
              <ProtectedRoute>
                <SubmitForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;