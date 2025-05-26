import { useEffect, useRef, useState } from 'react';
import NodeCard from './NodeCard';

function renderNodeWithChildren(node, allNodes, updateNode, addChild, onFocus, limitToOneLevel = false) {
  const children = node.children.map((id) => allNodes[id]);

  return (
    <div className="flex flex-col items-center" key={node.id}>
      <NodeCard node={node} updateNode={updateNode} addChild={addChild} onClick={onFocus} />

      {children.length > 0 && (
        <div className="flex flex-col items-center mt-4 relative">
          <div className="w-0.5 h-6 bg-gray-400"></div>

          <div className="relative flex gap-12 pt-6 items-start">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-0" />

            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center relative z-10">
                <div className="absolute top-[-1.5rem] left-1/2 w-0.5 h-6 bg-gray-400 transform -translate-x-1/2"></div>
                {limitToOneLevel
                  ? (
                      <NodeCard
                        node={child}
                        updateNode={updateNode}
                        addChild={addChild}
                        onClick={onFocus}
                      />
                    )
                  : renderNodeWithChildren(child, allNodes, updateNode, addChild, onFocus, false)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreeVisualizer({ tree, updateNode, addChild }) {
  const [focusId, setFocusId] = useState(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef();

  if (!tree || !tree.root) {
    return <div className="p-4 text-gray-500">Loading tree...</div>;
  }

  const allNodes = { [tree.root.id]: tree.root, ...tree.nodes };
  const focusedNode = focusId ? allNodes[focusId] : tree.root;

  // Automatically scale to fit full tree view horizontally
  useEffect(() => {
    if (!containerRef.current || focusId) return;

    const nodeCount = tree.root.children.length || 1;
    const estimatedTreeWidth = nodeCount * 300 + (nodeCount - 1) * 48;
    const containerWidth = containerRef.current.offsetWidth;

    const nextScale = Math.min(1, Math.max(0.5, containerWidth / estimatedTreeWidth));
    setScale(nextScale);
  }, [tree, focusId]);

  return (
    <div className="w-full h-full overflow-auto" ref={containerRef}>
      <div
        className={`shrink-0 ${focusId ? '' : 'min-w-[1200px]'}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top', transition: 'transform 0.3s ease-out' }}
      >
        {focusId && (
          <button
            onClick={() => setFocusId(null)}
            className="mb-6 px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            ← Back to Full Tree
          </button>
        )}

        {renderNodeWithChildren(
          focusedNode,
          allNodes,
          updateNode,
          addChild,
          setFocusId,
          focusId !== null // Limit to one level only if zoomed in
        )}
      </div>
    </div>
  );
}
