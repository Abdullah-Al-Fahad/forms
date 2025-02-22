import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract the search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  // Fetch search results when the component mounts
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/templates/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <p>Loading search results...</p>;

  return (
    <div className="container mt-5">
      <h2>Search Results for "{query}"</h2>

      {results.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="row">
          {results.map((template) => (
            <div key={template.id} className="col-md-4 mb-4">
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;