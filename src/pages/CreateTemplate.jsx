import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuestionEditor from '../components/QuestionEditor';

const CreateTemplate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagQuery, setTagQuery] = useState('');
  const [imageFile, setImageFile] = useState(null); // Image file
  const [imageUrl, setImageUrl] = useState('');    // ImgBB URL
  const navigate = useNavigate();

  const IMGBB_API_KEY = 'fbdc4c0e79b51f6941c04b5e7a26101c'; // ImgBB API key

  useEffect(() => {
    const fetchTags = async () => {
      if (tagQuery.trim() === '') return;
      try {
        const response = await axios.get(`/api/tags/autocomplete?query=${tagQuery}`);
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [tagQuery]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag.name)) {
      setSelectedTags([...selectedTags, tag.name]);
    }
    setTagQuery('');
  };

  const handleTagRemove = (tagName) => {
    setSelectedTags(selectedTags.filter((name) => name !== tagName));
  };

  const handleAddTag = async () => {
    if (tagQuery.trim() === '') return;

    try {
      const existingTag = tags.find((tag) => tag.name.toLowerCase() === tagQuery.trim().toLowerCase());
      if (existingTag) {
        if (!selectedTags.includes(existingTag.name)) {
          setSelectedTags([...selectedTags, existingTag.name]);
        }
      } else {
        const response = await axios.post('/api/tags', { name: tagQuery.trim() });
        const newTag = response.data;
        if (!selectedTags.includes(newTag.name)) {
          setSelectedTags([...selectedTags, newTag.name]);
        }
      }
      setTagQuery('');
    } catch (error) {
      console.error('Error creating or fetching tag:', error);
      alert('Failed to create or fetch tag.');
    }
  };

  // 📤 Upload Image to ImgBB and return the uploaded URL
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64Image = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
        formData.append('image', base64Image);

        try {
          const response = await axios.post('https://api.imgbb.com/1/upload', formData);
          if (response.data.success) {
            const uploadedUrl = response.data.data.url; // ✅ Get ImgBB URL
            alert('Image uploaded successfully!');
            resolve(uploadedUrl); // Return the URL
          } else {
            alert('Failed to upload image.');
            reject(new Error('Failed to upload image.'));
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image.');
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Handle form submission with proper image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a template.');
        navigate('/login');
        return;
      }

      let uploadedImageUrl = '';
      if (imageFile) {
        uploadedImageUrl = await uploadImageToImgBB(imageFile); // ✅ Wait for upload
        setImageUrl(uploadedImageUrl); // Update state if needed
      }

      // Create Template with uploadedImageUrl
      const templateResponse = await axios.post(
        '/api/templates',
        {
          title,
          description,
          imageUrl: uploadedImageUrl, // ✅ Use uploaded URL
          isPublic,
          topic,
          questions,
          tags: selectedTags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Template created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('An error occurred while creating the template.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Template</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Topic */}
        <div className="mb-3">
          <label className="form-label">Topic</label>
          <input
            type="text"
            className="form-control"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageUrl && (
            <div className="mt-3">
              <p>Image Preview:</p>
              <img src={imageUrl} alt="Uploaded" width="200" />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Search or create tags..."
            />
            <button type="button" className="btn btn-outline-primary" onClick={handleAddTag}>
              Add Tag
            </button>
          </div>

          {/* Autocomplete suggestions */}
          {tags.length > 0 && (
            <ul className="list-group mt-1">
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}

          {/* Selected tags */}
          <div className="mt-2">
            {selectedTags.map((tagName, index) => (
              <span key={index} className="badge bg-primary me-2">
                {tagName}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => handleTagRemove(tagName)}
                ></button>
              </span>
            ))}
          </div>
        </div>

        {/* Make Public */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Make Public</label>
        </div>

        {/* Questions */}
        <h4>Questions</h4>
        <QuestionEditor questions={questions} setQuestions={setQuestions} />

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create Template
        </button>
      </form>
    </div>
  );
};

export default CreateTemplate;
