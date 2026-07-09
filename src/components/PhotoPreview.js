import React from 'react';
import { FiImage, FiLoader } from 'react-icons/fi';
import './PhotoPreview.css';

function PhotoPreview({ photos, loading }) {
  if (loading) {
    return (
      <div className="photo-preview">
        <div className="loading">
          <FiLoader className="spinner" size={32} />
          <p>写真情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="photo-preview">
      <h2>ステップ 2: プレビュー</h2>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <div key={index} className="photo-card">
            <div className="photo-icon">
              <FiImage size={32} />
            </div>
            <div className="photo-info">
              <p className="photo-name">{photo.name}</p>
              <p className="photo-date">
                📅 {photo.year}/{photo.month}/{photo.day}
              </p>
              <p className="photo-size">
                💾 {(photo.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoPreview;
