import React, { useState } from 'react';
import './App.css';
import FolderSelector from './components/FolderSelector';
import OutputFolderSelector from './components/OutputFolderSelector';
import DirectoryTree from './components/DirectoryTree';
import FileList from './components/FileList';
import PhotoPreview from './components/PhotoPreview';
import OrganizeButton from './components/OrganizeButton';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [outputFolder, setOutputFolder] = useState(null);
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFolderSelect = async (folderPath) => {
    setSelectedFolder(folderPath);
    setError(null);
    setPhotos([]);
    setResults(null);
    setSelectedTreeNode(null);
    setFileList([]);
    await loadPhotoPreview(folderPath);
  };

  const handleOutputFolderSelect = async (folderPath) => {
    setOutputFolder(folderPath);
    setError(null);
    setSelectedTreeNode(null);
    setFileList([]);
    await loadDirectoryTree(folderPath);
  };

  const loadPhotoPreview = async (folderPath) => {
    setLoading(true);
    try {
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

  const loadDirectoryTree = async (folderPath) => {
    setLoading(true);
    try {
      const response = await window.electron.getDirectoryTree(folderPath);
      if (response.success) {
        setTreeData(response.data);
      } else {
        setError('フォルダツリーの読み込みに失敗しました');
      }
    } catch (err) {
      setError('フォルダツリーの読み込みに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTreeNodeSelect = async (nodePath) => {
    setSelectedTreeNode(nodePath);
    setLoading(true);
    try {
      const response = await window.electron.getDirectoryFiles(nodePath);
      if (response.success) {
        setFileList(response.data);
      } else {
        setError('ファイル一覧の読み込みに失敗しました');
        setFileList([]);
      }
    } catch (err) {
      setError('ファイル一覧の読み込みに失敗しました');
      console.error(err);
      setFileList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganize = async () => {
    if (!selectedFolder) {
      setError('ソースフォルダを選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await window.electron.organizePhotos(selectedFolder, outputFolder);
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
            <div className="content-wrapper">
              <div className="left-panel">
                <FolderSelector
                  selectedFolder={selectedFolder}
                  onSelect={handleFolderSelect}
                  disabled={loading}
                />

                {selectedFolder && (
                  <>
                    <PhotoPreview photos={photos} loading={loading} />
                  </>
                )}
              </div>

              <div className="right-panel">
                <OutputFolderSelector
                  selectedFolder={outputFolder}
                  onSelect={handleOutputFolderSelect}
                  disabled={loading}
                />

                {outputFolder && treeData && (
                  <div className="tree-container">
                    <DirectoryTree
                      data={treeData}
                      onNodeSelect={handleTreeNodeSelect}
                      selectedNode={selectedTreeNode}
                    />
                  </div>
                )}

                {selectedTreeNode && fileList.length > 0 && (
                  <div className="file-list-container">
                    <h3>📁 ファイル一覧</h3>
                    <FileList files={fileList} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ResultsDisplay
              results={results}
              onReset={() => {
                setResults(null);
                setSelectedFolder(null);
                setOutputFolder(null);
                setPhotos([]);
                setTreeData(null);
                setFileList([]);
                setSelectedTreeNode(null);
              }}
            />
          )}

          {selectedFolder && !results && (
            <div className="organize-button-container">
              <OrganizeButton
                onClick={handleOrganize}
                disabled={loading || !selectedFolder}
                loading={loading}
              />
            </div>
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