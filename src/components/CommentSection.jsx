import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ templateId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/comments/${templateId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [templateId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/comments/${templateId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/comments/${commentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.map((comment) => (comment.id === commentId ? response.data : comment)));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-4">
      <h4>Comments</h4>
      {comments.length > 0 ? (
        <ul className="list-group mb-3">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <strong>{comment.user?.username || "Anonymous"}</strong>
              <small className="text-muted ms-2">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Unknown date"}
              </small>
              {editingComment === comment.id ? (
                <form onSubmit={(e) => handleUpdateComment(e, comment.id)}>
                  <input
                    type="text"
                    className="form-control"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success btn-sm mt-1">Save</button>
                  <button type="button" className="btn btn-secondary btn-sm mt-1 ms-1" onClick={() => setEditingComment(null)}>Cancel</button>
                </form>
              ) : (
                <p>{comment.content}</p>
              )}
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditComment(comment)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      <form onSubmit={handleAddComment}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
