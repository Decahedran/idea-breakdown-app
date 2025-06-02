import { useState, useEffect } from 'react';

export default function NodeCard({ node, updateNode, addChild, onClick }) {
  const colors = ['gray', 'blue', 'green', 'yellow', 'red', 'purple'];
  const [color, setColor] = useState(node.color || 'gray');
  const [metadata, setMetadata] = useState(node.metadata || { link: '', image: '', notes: '' });

  useEffect(() => {
    updateNode(node.id, node.content, color, metadata);
  }, [color, metadata]);

  const handleMetadataChange = (field, value) => {
    const newMetadata = { ...metadata, [field]: value };
    setMetadata(newMetadata);
  };

  return (
    <div
      className={`bg-white border border-gray-300 rounded-lg shadow p-4 w-64 text-sm cursor-pointer hover:ring-2 transition hover:ring-${color}-300`}
      onClick={() => onClick?.(node.id)}
    >
      {/* Display orgCode */}
      {node.orgCode && (
        <div className="text-gray-500 text-xs font-mono mb-2 text-right">
          #{node.orgCode}
        </div>
      )}

      {/* Content input */}
      <textarea
        value={node.content}
        onChange={(e) => updateNode(node.id, e.target.value, color, metadata)}
        placeholder={`Layer ${node.depth}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full border-b p-1 focus:outline-none resize-none overflow-hidden break-words"
        style={{ minHeight: '40px' }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      {/* Color selector */}
      <div className="flex gap-2 mt-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation();
              setColor(c);
            }}
            className={`w-5 h-5 rounded-full bg-${c}-500 border-2 ${color === c ? 'border-black' : 'border-white'}`}
          />
        ))}
      </div>

      {/* Metadata inputs */}
      <div className="mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Link URL"
          className="w-full border p-1 text-sm"
          value={metadata.link}
          onChange={(e) => handleMetadataChange('link', e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full border p-1 text-sm"
          value={metadata.image}
          onChange={(e) => handleMetadataChange('image', e.target.value)}
        />
        <textarea
          placeholder="Notes"
          className="w-full border p-1 text-sm"
          rows={2}
          value={metadata.notes}
          onChange={(e) => handleMetadataChange('notes', e.target.value)}
        />
      </div>

      {/* Add child button */}
      {node.children.length < 3 && node.depth < 6 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            addChild(node.id);
          }}
          className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          + Add Child
        </button>
      )}
    </div>
  );
}
