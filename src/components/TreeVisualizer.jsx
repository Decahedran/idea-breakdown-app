import NodeCard from './NodeCard';

export default function TreeVisualizer({ tree, updateNode, addChild }) {
  const allNodes = { [tree.root.id]: tree.root, ...tree.nodes };
  const layers = Array.from({ length: 6 }, () => []);

  Object.values(allNodes).forEach(node => {
    if (node.depth <= 6) {
      layers[node.depth - 1].push(node);
    }
  });

  return (
    <div className="space-y-8">
      {layers.map((layer, idx) => (
        <div key={idx} className="flex justify-center gap-4 flex-wrap">
          {layer.map(node => (
            <NodeCard key={node.id} node={node} updateNode={updateNode} addChild={addChild} />
          ))}
        </div>
      ))}
    </div>
  );
}
