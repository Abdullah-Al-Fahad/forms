import React from 'react';

const QuestionsTab = ({ template, answers, handleInputChange, handleSubmit }) => {
  return (
    <div>
      <h3>Questions</h3>
      {template.questions?.length ? (
        <form onSubmit={handleSubmit}>
          {template.questions.map((question) => (
            <div key={question.id} className="mb-3">
              <label className="form-label" htmlFor={`question-${question.id}`}>
                {question.title}
              </label>
              {question.type === 'checkbox' && question.options?.length > 0 && (
                <div>
                  {question.options.map((option) => (
                    <div key={option} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={option}
                        checked={(answers[question.id] || []).includes(option)}
                        onChange={(e) => {
                          const selectedOptions = answers[question.id] || [];
                          handleInputChange(
                            question.id,
                            e.target.checked
                              ? [...selectedOptions, option]
                              : selectedOptions.filter((item) => item !== option)
                          );
                        }}
                      />
                      <label className="form-check-label">{option}</label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'integer' && (
                <input
                  type="number"
                  className="form-control"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, parseInt(e.target.value, 10))}
                  required
                />
              )}
              {question.type === 'multi-line' && (
                <textarea
                  className="form-control"
                  rows="3"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required
                ></textarea>
              )}
              {question.type === 'single-line' && (
                <input
                  type="text"
                  className="form-control"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default QuestionsTab;