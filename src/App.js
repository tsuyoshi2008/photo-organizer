import React, { useState } from 'react';
import './App.css';
import DirectoryTree from './components/DirectoryTree';
import FileList from './components/FileList';
import OrganizeButton from './components/OrganizeButton';
import ResultsDisplay from './components/ResultsDisplay';
import { FiFolder } from 'react-icons/fi';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFolderSelect = async () => {
    const folder = await window.electron.selectFolder();
    if (folder) {
      setSelectedFolder(folder);
      setError(null);
      setSelectedTreeNode(null);
      setFileList([]);
      await loadDirectoryTree(folder);
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
      setError('フォルダを選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await window.electron.organizePhotos(selectedFolder, selectedFolder);
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
              <div className="folder-selector-bar">
                <button
                  onClick={handleFolderSelect}
                  disabled={loading}
                  className="select-folder-button"
                >
                  <FiFolder size={20} />
                  フォルダを選択
                </button>
                {selectedFolder && (
                  <span className="selected-folder-display">{selectedFolder}</span>
                )}
              </div>

              {selectedFolder && (
                <div className="split-view">
                  <div className="left-panel">
                    {treeData && (
                      <DirectoryTree
                        data={treeData}
                        onNodeSelect={handleTreeNodeSelect}
                        selectedNode={selectedTreeNode}
                      />
                    )}
                  </div>

                  <div className="right-panel">
                    {selectedTreeNode && fileList.length > 0 && (
                      <FileList files={fileList} />
                    )}
                    {selectedTreeNode && fileList.length === 0 && (
                      <div className="empty-state">
                        <p>このフォルダは空です</p>
                      </div>
                    )}
                    {!selectedTreeNode && (
                      <div className="empty-state">
                        <p>左のツリーからフォルダを選択してください</p>
                      </div>
                    )}
                  </div>
                </div>
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
            </>
          ) : (
            <ResultsDisplay
              results={results}
              onReset={() => {
                setResults(null);
                setSelectedFolder(null);
                setTreeData(null);
                setFileList([]);
                setSelectedTreeNode(null);
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