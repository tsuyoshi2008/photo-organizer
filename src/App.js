import React, { useState } from 'react';
import './App.css';
import FolderSelector from './components/FolderSelector';
import PhotoPreview from './components/PhotoPreview';
import OrganizeButton from './components/OrganizeButton';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFolderSelect = async (folderPath) => {
    setSelectedFolder(folderPath);
    setError(null);
    setPhotos([]);
    setResults(null);
    await loadPhotoPreview(folderPath);
  };

  const loadPhotoPreview = async (folderPath) => {
    setLoading(true);
    try {
      // フォルダ内のファイル一覧を読み込む
      // フロントエンドではAPIを通じてバックエンドから取得
      const response = await window.electron.getPhotoInfo(folderPath);
      if (response.success) {
        setPhotos([response.data]);
      }
    } catch (err) {
      setError('写真情報の読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganize = async () => {
    if (!selectedFolder) {
      setError('フォルダを選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await window.electron.organizePhotos(selectedFolder);
      if (response.success) {
        setResults(response.data);
      } else {
        setError(response.error || '整理に失敗しました');
      }
    } catch (err) {
      setError(err.message || '予期しないエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 Photo Organizer</h1>
        <p>写真を撮影日ごとにフォルダに自動振り分け</p>
      </header>

      <main className="app-main">
        <div className="container">
          {error && <div className="error-message">{error}</div>}

          {!results ? (
            <>
              <FolderSelector
                selectedFolder={selectedFolder}
                onSelect={handleFolderSelect}
                disabled={loading}
              />

              {selectedFolder && (
                <>
                  <PhotoPreview photos={photos} loading={loading} />
                  <OrganizeButton
                    onClick={handleOrganize}
                    disabled={loading || !selectedFolder}
                    loading={loading}
                  />
                </>
              )}
            </>
          ) : (
            <ResultsDisplay
              results={results}
              onReset={() => {
                setResults(null);
                setSelectedFolder(null);
                setPhotos([]);
              }}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Photo Organizer | Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
