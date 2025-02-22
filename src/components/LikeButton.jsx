import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LikeButton = ({ templateId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/likes/${templateId}/likes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLikesCount(response.data.count);
        setLiked(response.data.userLiked);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [templateId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (liked) {
        await axios.delete(`/api/likes/${templateId}/likes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await axios.post(`/api/likes/${templateId}/likes`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleLike}>
      {liked ? 'Unlike' : 'Like'} ({likesCount})
    </button>
  );
};

export default LikeButton;
