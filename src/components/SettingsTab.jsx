import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SettingsTab = ({ template, user, onUpdate }) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: template.title,
    description: template.description,
    imageUrl: template.imageUrl,
    isPublic: template.isPublic,
    topic: template.topic,
    tags: template.tags.map((tag) => tag.name),
  });
  const [tagQuery, setTagQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null); // For image upload
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
    if (!formData.tags.includes(tag.name)) {
      setFormData({ ...formData, tags: [...formData.tags, tag.name] });
    }
    setTagQuery('');
  };

  const handleTagRemove = (tagName) => {
    setFormData({ ...formData, tags: formData.tags.filter((name) => name !== tagName) });
  };

  const handleAddTag = async () => {
    if (tagQuery.trim() === '') return;

    try {
      const existingTag = tags.find((tag) => tag.name.toLowerCase() === tagQuery.trim().toLowerCase());
      if (existingTag) {
        if (!formData.tags.includes(existingTag.name)) {
          setFormData({ ...formData, tags: [...formData.tags, existingTag.name] });
        }
      } else {
        const response = await axios.post('/api/tags', { name: tagQuery.trim() });
        const newTag = response.data;
        if (!formData.tags.includes(newTag.name)) {
          setFormData({ ...formData, tags: [...formData.tags, newTag.name] });
        }
      }
      setTagQuery('');
    } catch (error) {
      console.error('Error creating or fetching tag:', error);
      alert('Failed to create or fetch tag.');
    }
  };

  // Upload image to ImgBB
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
            const uploadedUrl = response.data.data.url;
            alert('Image uploaded successfully!');
            resolve(uploadedUrl);
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

  const handleUpdateTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update the template.');
        return;
      }

      let uploadedImageUrl = formData.imageUrl;
      if (imageFile) {
        uploadedImageUrl = await uploadImageToImgBB(imageFile); // Upload new image
      }

      const response = await axios.put(
        `/api/templates/${template.id}`,
        { ...formData, imageUrl: uploadedImageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('Template updated successfully!');
        setEditMode(false);
        onUpdate(response.data); // Notify parent component to update the template
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update the template.');
    }
  };

  return (
    <div>
      <h3>{t('settings')}</h3>
      {editMode ? (
        <form>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* Topic */}
          <div className="mb-3">
            <label className="form-label">Topic</label>
            <input
              type="text"
              className="form-control"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
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
            {formData.imageUrl && (
              <div className="mt-3">
                <p>Current Image:</p>
                <img src={formData.imageUrl} alt="Current" width="200" />
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
              {formData.tags.map((tagName, index) => (
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
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
            <label className="form-check-label">Make Public</label>
          </div>

          {/* Update and Cancel Buttons */}
          <button type="button" className="btn btn-primary" onClick={handleUpdateTemplate}>
            Update Template
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>{t('title')}</strong> {template.title}</p>
          <p><strong>{t('description')}:</strong> {template.description}</p>
          <p><strong>{t('topic')}:</strong> {template.topic}</p>
          <p><strong>{t('imageUrl')}:</strong> {template.imageUrl}</p>
          <p><strong>{t('isPublic')}:</strong> {template.isPublic ? 'Yes' : 'No'}</p>
          <p><strong>{t('tags')}:</strong> {template.tags.map((tag) => tag.name).join(', ')}</p>
          <button type="button" className="btn btn-primary" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;