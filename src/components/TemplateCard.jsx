import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TemplateCard = ({ template }) => {
  const { t } = useTranslation();

  return (
    <div className="card h-100 shadow-sm">
      {/* Template Image */}
      {template.imageUrl && (
        <img
          src={template.imageUrl}
          alt={template.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}

      <div className="card-body d-flex flex-column">
        {/* Title */}
        <h5 className="card-title">{template.title}</h5>

        {/* Description */}
        <p className="card-text flex-grow-1">
          {template.description || t('noDescriptionAvailable')}
        </p>

        {/* Topic */}
        <div className="mb-2">
          <strong>{t('topic')}:</strong> {template.topic || t('notSpecified')}
        </div>

        {/* Tags */}
        <div className="mb-3">
          <strong>{t('tags')}:</strong>{' '}
          {template.tags.length > 0 ? (
            <span>
              {template.tags.map((tag) => (
                <span key={tag.id} className="badge bg-primary me-1">
                  {tag.name}
                </span>
              ))}
            </span>
          ) : (
            t('noTags')
          )}
        </div>

        {/* Metadata */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          {/* Author */}
          <small className="text-muted">
          
          </small>

          {/* View Button */}
          <Link to={`/templates/${template.id}`} className="btn btn-primary btn-sm">
            {t('view')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;