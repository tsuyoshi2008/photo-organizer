import React from 'react';
import { FiFolder } from 'react-icons/fi';
import './FolderSelector.css';

function FolderSelector({ selectedFolder, onSelect, disabled }) {
  const handleClick = async () => {
    try {
      const folderPath = await window.electron.selectFolder();
      if (folderPath) {
        onSelect(folderPath);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <div className="folder-selector">
      <h2>ステップ 1: フォルダを選択</h2>
      <button
        className="select-folder-btn"
        onClick={handleClick}
        disabled={disabled}
      >
        <FiFolder size={24} />
        <span>フォルダを選択</span>
      </button>
      {selectedFolder && (
        <div className="selected-path">
          <strong>選択済みパス:</strong>
          <p>{selectedFolder}</p>
        </div>
      )}
    </div>
  );
}

export default FolderSelector;
