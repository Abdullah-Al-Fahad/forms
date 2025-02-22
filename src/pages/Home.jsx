import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TemplateCard from '../components/TemplateCard'; // Import TemplateCard component
import { useTranslation } from 'react-i18next';

const Home = ({ searchQuery }) => {
  const [templates, setTemplates] = useState([]); // All templates
  const [filteredTemplates, setFilteredTemplates] = useState([]); // Filtered templates
  const [topTemplates, setTopTemplates] = useState([]); // Top 5 most popular templates
  const [popularTags, setPopularTags] = useState([]); // Popular tags
  const [selectedTags, setSelectedTags] = useState([]); // Selected tags
  const [loading, setLoading] = useState(true); // Loading state
  const { t } = useTranslation();

  // Fetch all templates and their results when the component mounts
  useEffect(() => {
    const fetchTemplatesAndTags = async () => {
      try {
        setLoading(true);

        // Fetch all templates
        const response = await axios.get('/api/templates');
        const allTemplates = response.data;

        // Fetch results for each template and calculate popularity
        const templatesWithResults = await Promise.all(
          allTemplates.map(async (template) => {
            try {
              const resultsResponse = await axios.get(`/api/templates/${template.id}/results`);
              return {
                ...template,
                resultCount: resultsResponse.data.length, // Number of filled forms
              };
            } catch (error) {
              console.error(`Error fetching results for template ${template.id}:`, error);
              return { ...template, resultCount: 0 }; // Default to 0 if results cannot be fetched
            }
          })
        );

        // Sort templates by result count in descending order
        const sortedTemplates = templatesWithResults.sort((a, b) => b.resultCount - a.resultCount);
        setTopTemplates(sortedTemplates.slice(0, 5));
        setTemplates(allTemplates);
        setFilteredTemplates(allTemplates);

        // Fetch popular tags
        const tagsResponse = await axios.get('/api/tags/popular');
        setPopularTags(tagsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesAndTags();
  }, []);

  // Filter templates whenever the search query or selected tags change
  useEffect(() => {
    let filtered = templates;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((template) => {
        const matchesTitle = template.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDescription = template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = template.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesQuestions = template.questions.some((question) =>
          question.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesTitle || matchesDescription || matchesTags || matchesQuestions;
      });
    }

    // Apply selected tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((template) =>
        selectedTags.every((selectedTag) =>
          template.tags.some((tag) => tag.name === selectedTag)
        )
      );
    }

    setFilteredTemplates(filtered);
  }, [searchQuery, selectedTags, templates]);

  // Handle tag click to toggle selection
  const handleTagClick = (tagName) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tagName)
        ? prevSelectedTags.filter((tag) => tag !== tagName) // Remove tag if already selected
        : [...prevSelectedTags, tagName] // Add tag if not selected
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      {/* Create Template Button */}
      <div className="d-flex justify-content-end mb-4">
        <Link to="/create-template" className="btn btn-primary">
          {t('createTemplate')}
        </Link>
      </div>

      {/* Tag Cloud Section */}
      <h3>{t('Popular Tags')}</h3>
      <div className="d-flex flex-wrap mb-4">
        {popularTags.map((tag) => (
          <button
            key={tag.id}
            className={`btn btn-sm me-2 mb-2 ${
              selectedTags.includes(tag.name) ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name} ({tag.count}) {/* Display tag name and count */}
          </button>
        ))}
      </div>

      {/* Top 5 Most Popular Templates Section */}
      <h3>{t('Popular Templates')}</h3>
      <div className="row mb-5">
        {topTemplates.length > 0 ? (
          topTemplates.map((template, index) => (
            <div key={template.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{template.title}</h5>
                  <p className="card-text">{template.description}</p>
                  <p className="card-text">
                    <strong>Rank:</strong> {index + 1}
                  </p>
                  <p className="card-text">
                    <strong>Filled Forms:</strong> {template.resultCount}
                  </p>
                  <Link to={`/templates/${template.id}`} className="btn btn-primary btn-sm">
                    {t('view')}
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{t('noPopularTemplatesAvailable')}</p>
        )}
      </div>

      {/* All Templates Section */}
      <h3>{t('allTemplates')}</h3>
      <div className="row">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div key={template.id} className="col-md-4 mb-4">
              <TemplateCard template={template} />
            </div>
          ))
        ) : (
          <p>{t('noTemplatesAvailable')}</p>
        )}
      </div>
    </div>
  );
};

export default Home;