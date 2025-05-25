import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, [user.id]);

  const createProject = async () => {
    if (!projectName.trim()) return;

    const newTree = {
      root: {
        id: 'root',
        content: projectName,
        children: [],
        depth: 1,
        parentId: null
      },
      nodes: {}
    };

    const { data, error } = await supabase.from('projects').insert([
      {
        name: projectName,
        user_id: user.id,
        tree_data: newTree
      }
    ]).select().single();

    if (!error && data) {
      navigate(`/project/${data.id}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <button
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(project => (
            <li key={project.id} className="flex justify-between items-center border p-4 rounded hover:bg-gray-100">
              <span>{project.name}</span>
              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="text-blue-600 hover:underline"
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
