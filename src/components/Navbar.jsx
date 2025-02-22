import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../AuthContext';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ onSearch }) => {
  const { isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const isHomePage = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // Pass the search query to the parent component
  };

  // Clear search query and show all templates when the input is cleared
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === '') {
      onSearch(''); // Pass an empty string to show all templates
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand">
          {t('Forms')}
        </Link>

        {isHomePage && (
          <form className="d-flex mx-auto" onSubmit={handleSearch} style={{ width: '40%' }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder={t('Search')}
              value={searchQuery}
              onChange={handleInputChange} // Use handleInputChange
            />
            <button className="btn btn-outline-light" type="submit">
              {t('Search')}
            </button>
          </form>
        )}

        <div className="d-flex align-items-center">
          <LanguageSwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="btn btn-outline-light ms-3">
                {t('Profile')}
              </Link>
              <button className="btn btn-danger ms-3" onClick={logout}>
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-success ms-3">
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;