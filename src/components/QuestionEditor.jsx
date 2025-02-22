import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableItem from './sitem';

const QuestionEditor = ({ questions, setQuestions }) => {
  // Add a new question
  const addQuestion = (type) => {
    const countOfType = questions.filter((q) => q.type === type).length;
    if (countOfType >= 4) {
      alert(`You can only add up to 4 ${type} questions.`);
      return;
    }

    // Map the type to the correct backend-compatible value
    const mappedType = {
      text: 'single-line', // Map "text" to "single-line"
      textarea: 'multi-line', // Map "textarea" to "multi-line"
      integer: 'integer',
      checkbox: 'checkbox',
    }[type];

    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: Date.now(), // Temporary unique ID
        type: mappedType,
        title: '',
        options: type === 'checkbox' ? [''] : undefined,
        position: prevQuestions.length, // Set position based on array length
      },
    ]);
  };

  // Delete a question
  const deleteQuestion = (id) => {
    setQuestions((prevQuestions) => {
      const filtered = prevQuestions.filter((q) => q.id !== id);
      // Reassign positions after deletion
      return filtered.map((q, index) => ({ ...q, position: index }));
    });
  };

  // Update a specific question
  const updateQuestion = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((prevQuestions) => {
        const oldIndex = prevQuestions.findIndex((item) => item.id === active.id);
        const newIndex = prevQuestions.findIndex((item) => item.id === over.id);
        const newQuestions = arrayMove(prevQuestions, oldIndex, newIndex);

        // Update positions after reordering
        return newQuestions.map((q, index) => ({
          ...q,
          position: index,
        }));
      });
    }
  };

  // Define sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div>
      {/* Drag-and-Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          {questions.map((q) => (
            <SortableItem
              key={q.id}
              id={q.id}
              question={q}
              updateQuestion={updateQuestion}
              deleteQuestion={deleteQuestion}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Question Buttons */}
      <div className="mt-3">
        <h5>Add a New Question</h5>
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={() => addQuestion('text')}
          disabled={questions.filter((q) => q.type === 'single-line').length >= 4}
        >
          Single-Line Text
        </button>
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={() => addQuestion('textarea')}
          disabled={questions.filter((q) => q.type === 'multi-line').length >= 4}
        >
          Multi-Line Text
        </button>
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={() => addQuestion('integer')}
          disabled={questions.filter((q) => q.type === 'integer').length >= 4}
        >
          Positive Integer
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addQuestion('checkbox')}
          disabled={questions.filter((q) => q.type === 'checkbox').length >= 4}
        >
          Checkbox
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;
