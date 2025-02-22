import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Aggregation = ({ templateId }) => {
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const fetchAndAggregateResults = async () => {
      try {
        setLoading(true);

        // Fetch template data to get questions
        const templateResponse = await axios.get(`/api/templates/${templateId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        const template = templateResponse.data;
        const questionMap = {};
        template.questions.forEach((q) => {
          questionMap[q.id] = q.title;
        });
        setQuestions(questionMap);

        // Fetch results
        const resultsResponse = await axios.get(`/api/templates/${templateId}/results`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const results = resultsResponse.data;
        if (!results || results.length === 0) {
          setAggregatedData({});
          setLoading(false);
          return;
        }

        // Aggregate data by question
        const aggregation = {};
        results.forEach((form) => {
          form.answers.forEach((answer) => {
            const questionId = answer.questionId;
            const value = answer.value;

            if (!aggregation[questionId]) {
              aggregation[questionId] = { values: [] };
            }

            aggregation[questionId].values.push(value);
          });
        });

        // Compute statistics
        const computedAggregation = {};
        Object.entries(aggregation).forEach(([questionId, data]) => {
          const values = data.values;
          const isNumeric = values.every((v) => !isNaN(v));

          if (isNumeric) {
            const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
            computedAggregation[questionId] = { aggregatedValue: `Average: ${(sum / values.length).toFixed(2)}` };
          } else {
            const frequencyMap = {};
            values.forEach((val) => {
              frequencyMap[val] = (frequencyMap[val] || 0) + 1;
            });
            const mostCommon = Object.keys(frequencyMap).reduce((a, b) => frequencyMap[a] > frequencyMap[b] ? a : b);
            computedAggregation[questionId] = { aggregatedValue: `Most Common: ${mostCommon}` };
          }
        });

        setAggregatedData(computedAggregation);
      } catch (error) {
        console.error('Error fetching or aggregating results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAggregateResults();
  }, [templateId]);

  if (loading) return <p>Loading aggregation data...</p>;
  if (!aggregatedData || Object.keys(aggregatedData).length === 0) return <p>No aggregation data available.</p>;

  return (
    <div>
      <h3>Aggregation</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Question</th>
            <th>Aggregated Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(aggregatedData).map(([questionId, data]) => (
            <tr key={questionId}>
              <td>{questions[questionId] || 'Unknown Question'}</td>
              <td>{data.aggregatedValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Aggregation;