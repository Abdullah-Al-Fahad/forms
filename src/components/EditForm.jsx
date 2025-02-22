import React from 'react';

const EditForm = ({ form, editingAnswers, onSave, onCancel, onChangeAnswer }) => {
  return (
    <div className="mt-4">
      <h4>Edit Form</h4>
      {form.answers.map((answer) => (
        <div key={answer.questionId} className="mb-3">
          <label>{answer.question.title}</label> {/* Display question title */}
          <input
            type="text"
            className="form-control"
            value={editingAnswers[answer.questionId] || ''}
            onChange={(e) => onChangeAnswer(answer.questionId, e.target.value)}
          />
        </div>
      ))}
      <button className="btn btn-success" onClick={onSave}>
        Save
      </button>
      <button className="btn btn-secondary ml-2" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default EditForm;