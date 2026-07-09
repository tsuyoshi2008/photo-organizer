import React, { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiFolder } from 'react-icons/fi';

const TreeNode = ({ node, onNodeSelect, selectedNode, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isSelected = selectedNode === node.path;

  const handleClick = () => {
    onNodeSelect(node.path);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            className="tree-toggle"
            onClick={handleToggle}
          >
            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </button>
        )}
        {!hasChildren && <span className="tree-toggle-placeholder" />}
        <FiFolder size={16} className="tree-icon" />
        <span className="tree-label">{node.name}</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onNodeSelect={onNodeSelect}
              selectedNode={selectedNode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DirectoryTree = ({ data, onNodeSelect, selectedNode }) => {
  return (
    <div className="directory-tree">
      <h3>📁 フォルダ構造</h3>
      <div className="tree-container-inner">
        {data ? (
          <TreeNode
            node={data}
            onNodeSelect={onNodeSelect}
            selectedNode={selectedNode}
          />
        ) : (
          <p>フォルダツリーを読み込んでいます...</p>
        )}
      </div>
    </div>
  );
};

export default DirectoryTree;