import React from 'react';
import { FiFile, FiFolder } from 'react-icons/fi';

const FileList = ({ files }) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  return (
    <div className="file-list">
      <div className="file-list-header">
        <div className="file-name">名前</div>
        <div className="file-type">種類</div>
        <div className="file-size">サイズ</div>
        <div className="file-modified">更新日時</div>
      </div>
      <div className="file-list-items">
        {files.map((file) => (
          <div key={file.path} className="file-list-item">
            <div className="file-name">
              {file.type === 'directory' ? (
                <>
                  <FiFolder size={16} className="file-icon" />
                  {file.name}
                </>
              ) : (
                <>
                  <FiFile size={16} className="file-icon" />
                  {file.name}
                </>
              )}
            </div>
            <div className="file-type">{file.type === 'directory' ? 'フォルダ' : 'ファイル'}</div>
            <div className="file-size">{file.type === 'directory' ? '-' : formatSize(file.size)}</div>
            <div className="file-modified">{formatDate(file.modified)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;