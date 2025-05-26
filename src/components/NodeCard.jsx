export default function NodeCard({ node, updateNode, addChild, onClick }) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow p-4 w-64 text-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition"
      onClick={() => onClick?.(node.id)}
    >
      <input
        type="text"
        value={node.content}
        onChange={(e) => updateNode(node.id, e.target.value)}
        placeholder={`Layer ${node.depth}`}
        onClick={(e) => e.stopPropagation()} // prevent zoom
        className="w-full border-b p-1 focus:outline-none"
      />
      {node.children.length < 3 && node.depth < 6 && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent zoom
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
