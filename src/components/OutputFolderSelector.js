import React from 'react';
import { FiFolder, FiCheck } from 'react-icons/fi';

const OutputFolderSelector = ({ selectedFolder, onSelect, disabled }) => {
  const handleSelectClick = async () => {
    const folder = await window.electron.selectOutputFolder();
    if (folder) {
      onSelect(folder);
    }
  };

  return (
    <div className="folder-selector output-folder-selector">
      <h3>📂 出力先フォルダを選択</h3>
      <button
        onClick={handleSelectClick}
        disabled={disabled}
        className="select-button"
      >
        <FiFolder size={20} />
        フォルダを選択
      </button>

      {selectedFolder && (
        <div className="selected-folder-info">
          <FiCheck color="green" size={20} />
          <div>
            <p className="label">選択済み:</p>
            <p className="path">{selectedFolder}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputFolderSelector;