import React from 'react';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import './OrganizeButton.css';

function OrganizeButton({ onClick, disabled, loading }) {
  return (
    <div className="organize-button-container">
      <h2>ステップ 3: 実行</h2>
      <button
        className="organize-btn"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <FiLoader className="spinner" size={20} />
            <span>整理中...</span>
          </>
        ) : (
          <>
            <FiArrowRight size={20} />
            <span>写真を整理開始</span>
          </>
        )}
      </button>
      <p className="organize-description">
        フォルダ内の写真を撮影日ごとに YYYY/MM/DD の形式で自動整理します。
      </p>
    </div>
  );
}

export default OrganizeButton;
