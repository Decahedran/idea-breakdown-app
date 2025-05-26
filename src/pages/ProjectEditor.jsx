import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import TreeVisualizer from '../components/TreeVisualizer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ProjectEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const exportRef = useRef(null);

  const [tree, setTree] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setTree(data.tree_data);
        setProjectName(data.name);
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

  useEffect(() => {
    const saveTree = async () => {
      if (!tree) return;
      await supabase
        .from('projects')
        .update({
          tree_data: tree,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
    };

    const delay = setTimeout(saveTree, 800);
    return () => clearTimeout(delay);
  }, [tree, id, user]);

  const saveProjectName = async () => {
    await supabase
      .from('projects')
      .update({ name: projectName })
      .eq('id', id)
      .eq('user_id', user.id);
  };

  if (loading) return <div className="p-6">Loading project...</div>;
  if (!tree) return <div className="p-6 text-red-600">Project not found.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Top toolbar */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={saveProjectName}
            className="text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none"
            style={{ width: '100%', maxWidth: '400px' }}
          />

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Return to Dashboard
            </button>

            <button
              onClick={async () => {
                if (!exportRef.current) return;
                const canvas = await html2canvas(exportRef.current);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${projectName.replace(/\s+/g, '_') || 'project'}.pdf`);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Export as PDF
            </button>

            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(tree, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${projectName.replace(/\s+/g, '_') || 'project'}.json`;
                link.click();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export as JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tree Visualizer section */}
      <div className="flex-1 overflow-auto bg-white p-4 rounded shadow-sm" ref={exportRef}>
        <TreeVisualizer tree={tree} updateNode={updateNode} addChild={addChild} />
      </div>
    </div>
  );
}
