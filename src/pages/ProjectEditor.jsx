import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import TreeVisualizer from '../components/TreeVisualizer';
import { useNavigate } from 'react-router-dom';

export default function ProjectEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setTree(data.tree_data);
      }

      setLoading(false);
    };

    if (user) fetchProject();
  }, [id, user]);

  const updateNode = (nodeId, content) => {
    setTree(prev => {
      const updated = { ...prev };

      if (nodeId === updated.root.id) {
        updated.root.content = content;
      } else if (updated.nodes[nodeId]) {
        updated.nodes[nodeId].content = content;
      }

      return updated;
    });
  };

  const addChild = (parentId) => {
    setTree(prev => {
      const updated = { ...prev };
      const parent = parentId === updated.root.id ? updated.root : updated.nodes[parentId];
      if (parent.children.length >= 3 || parent.depth >= 6) return updated;

      const newId = crypto.randomUUID();
      const newNode = {
        id: newId,
        content: '',
        children: [],
        depth: parent.depth + 1,
        parentId
      };

      parent.children.push(newId);
      updated.nodes[newId] = newNode;

      return updated;
    });
  };

  // 💾 Save to Supabase when tree updates
  useEffect(() => {
    const saveTree = async () => {
      if (!tree) return;
      await supabase
        .from('projects')
        .update({ tree_data: tree, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
    };

    const delay = setTimeout(saveTree, 800); // debounce save
    return () => clearTimeout(delay);
  }, [tree, id, user]);

  if (loading) return <div className="p-6">Loading project...</div>;
  if (!tree) return <div className="p-6 text-red-600">Project not found.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Editing: {tree.root.content}</h1>
  <button
    onClick={() => navigate('/dashboard')}
    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
  >
    Return to Dashboard
  </button>
</div>


      <TreeVisualizer tree={tree} updateNode={updateNode} addChild={addChild} />
    </div>
  );
}
