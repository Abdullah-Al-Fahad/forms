import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TemplateCard from '../components/TemplateCard';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all templates when the component mounts
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) return <p>Loading templates...</p>;

  return (
    <div className="container mt-5">
      <h3>All Templates</h3>
      <div className="row">
        {templates.map((template) => (
          <div key={template.id} className="col-md-4 mb-4">
            <TemplateCard template={template} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;