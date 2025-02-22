import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SubmitForm = () => {
  const { id } = useParams(); // Template ID from the URL
  const [questions, setQuestions] = useState([]); // Questions for the template
  const [answers, setAnswers] = useState({}); // User's answers
  const navigate = useNavigate();

  // Fetch the template's questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [id]);

  // Handle input changes for each question
  const handleInputChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/forms/${id}`,
        { answers },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Form submitted successfully!');
      navigate('/templates'); // Redirect to the templates page after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8">
        <h2>Submit Form</h2>
        <form onSubmit={handleSubmit}>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.id} className="mb-3">
                <label className="form-label">{question.title}</label>
                <input
                  type="text"
                  className="form-control"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required
                />
              </div>
            ))
          ) : (
            <p>Loading questions...</p>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitForm;