import React from 'react';

const ResultsTab = ({ results, template }) => {
  return (
    <div>
      <h3>Results</h3>
      {results.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {results.map((form, index) => (
              <tr key={index}>
                <td>{form.user?.username || 'Unknown User'}</td>
                <td>
                  <ul>
                    {form.answers.map((answer) => {
                      const question = template.questions.find((q) => q.id === answer.questionId);
                      return (
                        <li key={answer.questionId}>
                          <strong>{question?.title || 'Unknown Question'}:</strong> {answer.value || 'No answer'}
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default ResultsTab;
