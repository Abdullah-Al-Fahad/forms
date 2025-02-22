import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, question, updateQuestion, deleteQuestion }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f0f0f0' : '#fff',
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    position: 'relative',
  };

  // Handle updating checkbox options
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    updateQuestion(question.id, 'options', updatedOptions);
  };

  // Add a new checkbox option
  const addOption = () => {
    const updatedOptions = [...(question.options || []), ''];
    updateQuestion(question.id, 'options', updatedOptions);
  };

  // Remove a checkbox option
  const removeOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, 'options', updatedOptions);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="d-flex align-items-center">
        {/* Drag Handle */}
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            marginRight: '10px',
            fontSize: '1.2rem',
            userSelect: 'none',
          }}
          className="no-drag" // Prevent dragging interference
        >
          🖐️ {/* You can replace this with a custom drag icon */}
        </span>

        {/* Question Content */}
        <div style={{ flexGrow: 1 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Question</h5>
            {/* Delete Button */}
            <button
              type="button"
              className="btn btn-danger btn-sm no-drag"
              onClick={() => deleteQuestion(question.id)}
            >
              Delete
            </button>
          </div>

          {/* Title Field */}
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={question.title}
              onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
              placeholder="Enter question title"
              required
            />
          </div>

          {/* Checkbox Options */}
          {question.type === 'checkbox' && (
            <div className="mb-2">
              <label className="form-label">Checkbox Options</label>
              {question.options?.map((option, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addOption}
              >
                Add Option
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableItem;