import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiRotateCcw } from 'react-icons/fi';
import './ResultsDisplay.css';

function ResultsDisplay({ results, onReset }) {
  const successRate = results.total > 0 ? ((results.moved / results.total) * 100).toFixed(1) : 0;

  return (
    <div className="results-display">
      <div className="results-header">
        <FiCheckCircle size={48} className="success-icon" />
        <h2>整理完了しました！</h2>
      </div>

      <div className="results-stats">
        <div className="stat-card">
          <div className="stat-label">処理済み</div>
          <div className="stat-value">{results.moved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">失敗</div>
          <div className="stat-value error">{results.failed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">合計</div>
          <div className="stat-value">{results.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">成功率</div>
          <div className="stat-value">{successRate}%</div>
        </div>
      </div>

      {Object.keys(results.summary).length > 0 && (
        <div className="summary-section">
          <h3>📊 整理結果のサマリー</h3>
          <div className="summary-table">
            <div className="summary-header">
              <div className="summary-col">フォルダ</div>
              <div className="summary-col">ファイル数</div>
            </div>
            {Object.entries(results.summary)
              .sort()
              .map(([folder, count], index) => (
                <div key={index} className="summary-row">
                  <div className="summary-col">{folder}</div>
                  <div className="summary-col">{count}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {results.errors && results.errors.length > 0 && (
        <div className="errors-section">
          <h3>
            <FiAlertCircle size={20} /> エラー詳細
          </h3>
          <div className="errors-list">
            {results.errors.map((error, index) => (
              <div key={index} className="error-item">
                <strong>{error.file}</strong>: {error.error}
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="reset-btn" onClick={onReset}>
        <FiRotateCcw size={20} />
        <span>別のフォルダを処理</span>
      </button>
    </div>
  );
}

export default ResultsDisplay;
