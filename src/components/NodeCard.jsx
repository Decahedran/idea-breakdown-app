export default function NodeCard({ node, updateNode, addChild }) {
  return (
    <div className="p-4 border rounded shadow w-64 bg-white">
      <input
        type="text"
        className="w-full border p-2 mb-2"
        value={node.content}
        onChange={e => updateNode(node.id, e.target.value)}
        placeholder={`Layer ${node.depth}`}
      />
      {node.children.length < 3 && node.depth < 6 && (
        <button
          onClick={() => addChild(node.id)}
          className="w-full px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          + Add Child
        </button>
      )}
    </div>
  );
}
