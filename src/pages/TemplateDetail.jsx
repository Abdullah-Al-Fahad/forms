import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SettingsTab from '../components/SettingsTab'; // Import the SettingsTab component
import ManageQuestions from '../components/ManageQuestions';
import Aggregation from '../components/Aggregation';
import CommentSection from '../components/CommentSection';
import ResultsTab from '../components/ResultsTab';
import QuestionsTab from '../components/QuestionsTab';
import LikeButton from '../components/LikeButton';

const TemplateDetail = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`/api/templates/${id}`);
        setTemplate(response.data);
      } catch (error) {
        console.error('Error fetching template:', error);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchTemplate();
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'results' && user) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(`/api/templates/${id}/results`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching results:', error);
        }
      };
      fetchResults();
    }
  }, [activeTab, id, user]);

  const handleInputChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await axios.delete(`/api/templates/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Template deleted successfully.');
      navigate('/templates');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete the template.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit answers.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `/api/forms/${id}`,
        { answers },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Form submitted successfully!');
      navigate('/templates');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };

  const handleTemplateUpdate = (updatedTemplate) => {
    setTemplate(updatedTemplate); // Update the template state after successful update
  };

  if (!template) return <p>Loading...</p>;

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === template.userId;
  const canAccessAdminTabs = isAdmin || isOwner;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>{template.title}</h2>
        {canAccessAdminTabs && (
          <button className="btn btn-danger" onClick={handleDelete}>
            {t('deleteTemplate')}
          </button>
        )}
      </div>
      <p>{template.description}</p>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            {t('questions')}
          </a>
        </li>

        {canAccessAdminTabs && (
          <>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                {t('settings')}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                {t('results')}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'manage-questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('manage-questions')}
              >
                {t('manageQuestions')}
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'aggregation' ? 'active' : ''}`}
                onClick={() => setActiveTab('aggregation')}
              >
                {t('aggregation')}
              </a>
            </li>
          </>
        )}
      </ul>

      {activeTab === 'settings' && canAccessAdminTabs && (
        <SettingsTab template={template} user={user} onUpdate={handleTemplateUpdate} />
      )}

      {activeTab === 'questions' && (
        <QuestionsTab
          template={template}
          answers={answers}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      {activeTab === 'results' && canAccessAdminTabs && <ResultsTab results={results} template={template} />}
      {activeTab === 'aggregation' && canAccessAdminTabs && <Aggregation templateId={id} />}
      {activeTab === 'manage-questions' && canAccessAdminTabs && (
        <ManageQuestions template={template} setTemplate={setTemplate} />
      )}

      {/* Comment Section at the Bottom */}
      <LikeButton templateId={id} />
      <CommentSection templateId={id} />
    </div>
  );
};

export default TemplateDetail;