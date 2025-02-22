import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TemplateCard from '../components/TemplateCard';
import MyForms from '../components/MyForms';
import EditForm from '../components/EditForm';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [editingFormId, setEditingFormId] = useState(null);
  const [editingAnswers, setEditingAnswers] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch logged-in user details
        const userResponse = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const loggedInUserId = userResponse.data.id;
        setUserId(loggedInUserId);

        // Fetch all templates
        const templatesResponse = await axios.get('/api/templates', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter templates created by the logged-in user
        const userTemplates = templatesResponse.data.filter(
          (template) => template.userId === loggedInUserId
        );
        setTemplates(userTemplates);

        // Fetch forms submitted by the logged-in user
        const formsResponse = await axios.get('/api/forms/me/forms', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setForms(formsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditForm = (form) => {
    setEditingFormId(form.id);
    const initialAnswers = {};
    form.answers.forEach((answer) => {
      initialAnswers[answer.questionId] = answer.value;
    });
    setEditingAnswers(initialAnswers);
  }

  const handleSaveForm = async () => {
    try {
      await axios.put(
        `/api/forms/${editingFormId}`,
        { answers: editingAnswers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      // Reset editing state
      setEditingFormId(null);
      setEditingAnswers({});

      // Refetch forms to update the UI
      const formsResponse = await axios.get('/api/forms/me/forms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setForms(formsResponse.data);
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingFormId(null);
    setEditingAnswers({});
  };

  const handleChangeAnswer = (questionId, value) => {
    setEditingAnswers({ ...editingAnswers, [questionId]: value });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>My Profile</h2>

      {/* Tabs for Templates and Forms */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            My Templates
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            My Forms
          </a>
        </li>
      </ul>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <h3>My Templates</h3>
          {templates.length > 0 ? (
            <div className="row">
              {templates.map((template) => (
                <div key={template.id} className="col-md-4 mb-4">
                  <TemplateCard template={template} />
                </div>
              ))}
            </div>
          ) : (
            <p>No templates created yet.</p>
          )}
        </div>
      )}

      {/* Forms Tab */}
      {activeTab === 'forms' && (
        <div>
          <MyForms forms={forms} onEditForm={handleEditForm} />
        </div>
      )}

      {/* Edit Form Section */}
      {editingFormId && (
        <EditForm
          form={forms.find((form) => form.id === editingFormId)}
          editingAnswers={editingAnswers}
          onSave={handleSaveForm}
          onCancel={handleCancelEdit}
          onChangeAnswer={handleChangeAnswer}
        />
      )}
    </div>
  );
};

export default Profile;