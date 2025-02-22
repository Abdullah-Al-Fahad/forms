import React, { useState } from 'react';

const MyForms = ({ forms, onEditForm }) => {
  return (
    <div>
      <h3>My Forms</h3>
      {forms.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td>{form.template.title}</td>
                <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEditForm(form)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No forms submitted yet.</p>
      )}
    </div>
  );
};

export default MyForms;