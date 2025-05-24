import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TreeVisualizer from './components/TreeVisualizer';

const initialRootId = uuidv4();

export default function App() {
  const [tree, setTree] = useState({
    root: {
      id: initialRootId,
      content: 'What is your ultimate goal?',
      children: [],
      depth: 1,
      parentId: null
    },
    nodes: {}
  });

  const updateNode = (id, content) => {
    if (id === tree.root.id) {
      setTree(prev => ({
        ...prev,
        root: { ...prev.root, content }
      }));
    } else {
      setTree(prev => ({
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: {
            ...prev.nodes[id],
            content
          }
        }
      }));
    }
  };

  const addChild = (parentId) => {
    const newId = uuidv4();
    const parentNode = parentId === tree.root.id ? tree.root : tree.nodes[parentId];

    if (parentNode.children.length >= 3 || parentNode.depth >= 6) return;

    const newNode = {
      id: newId,
      content: '',
      children: [],
      depth: parentNode.depth + 1,
      parentId
    };

    const updatedParent = {
      ...parentNode,
      children: [...parentNode.children, newId]
    };

    setTree(prev => ({
      root: parentId === tree.root.id ? updatedParent : prev.root,
      nodes: {
        ...prev.nodes,
        [parentId]: updatedParent,
        [newId]: newNode
      }
    }));
  };

  return (
    <div className="p-6 max-w-screen overflow-x-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Idea Breakdown</h1>
      <TreeVisualizer tree={tree} updateNode={updateNode} addChild={addChild} />
    </div>
  );
}
