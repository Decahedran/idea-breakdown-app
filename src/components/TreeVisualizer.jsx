import { useState } from 'react';
import NodeCard from './NodeCard';

function TreeNode({
  node,
  allNodes,
  updateNode,
  addChild,
  onToggleExpand,
  isExpandedMap,
  onFocus,
  depth = 1,
  isFocusedView = false
}) {
  const isExpanded = isExpandedMap[node.id] ?? true;
  const children = node.children.map(id => allNodes[id]);

  return (
    <div className="ml-6 mt-4">
      <div className="flex items-center gap-2">
        {children.length > 0 && (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="text-xs px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
        <NodeCard
          node={node}
          updateNode={updateNode}
          addChild={addChild}
          onClick={onFocus}
        />
      </div>

      {isExpanded && children.length > 0 && (!isFocusedView || depth === 1) && (
        <div className="pl-6 border-l border-gray-300">
          {children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              allNodes={allNodes}
              updateNode={updateNode}
              addChild={addChild}
              onToggleExpand={onToggleExpand}
              isExpandedMap={isExpandedMap}
              onFocus={onFocus}
              depth={depth + 1}
              isFocusedView={isFocusedView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeVisualizer({ tree, updateNode, addChild }) {
  const [focusId, setFocusId] = useState(null);
  const [isExpandedMap, setIsExpandedMap] = useState({});
  const [zoom, setZoom] = useState(1);

  if (!tree || !tree.root) {
    return <div className="p-4 text-gray-500">Loading tree...</div>;
  }

  const allNodes = { [tree.root.id]: tree.root, ...tree.nodes };
  const focusedNode = focusId ? allNodes[focusId] : tree.root;

  const toggleExpand = (nodeId) => {
    setIsExpandedMap(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const resetFocus = () => setFocusId(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  const getBreadcrumbPath = (nodeId) => {
    const path = [];
    let current = allNodes[nodeId];
    while (current) {
      path.unshift(current);
      current = current.parentId ? allNodes[current.parentId] : null;
    }
    return path;
  };

  const breadcrumbs = focusId ? getBreadcrumbPath(focusId) : [];

  return (
    <div className="w-full h-full overflow-auto px-4 py-2">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {focusId && (
            <>
              <button
                onClick={resetFocus}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
              >
                ← Full Tree
              </button>
              {breadcrumbs.map((node, index) => (
                <span
                  key={node.id}
                  className="text-sm cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setFocusId(node.id)}
                >
                  {node.orgCode}
                  {index < breadcrumbs.length - 1 && ' / '}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="flex gap-2 text-sm">
          <button onClick={handleZoomOut} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
          <button onClick={handleZoomReset} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
          <button onClick={handleZoomIn} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
        </div>
      </div>

      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        <TreeNode
          node={focusedNode}
          allNodes={allNodes}
          updateNode={updateNode}
          addChild={addChild}
          onToggleExpand={toggleExpand}
          isExpandedMap={isExpandedMap}
          onFocus={setFocusId}
          depth={1}
          isFocusedView={!!focusId}
        />
      </div>
    </div>
  );
}
