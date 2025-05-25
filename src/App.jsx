import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import TreeVisualizer from './components/TreeVisualizer'; // placeholder for now
import { supabase } from './supabaseClient';

export default function App() {
  const { session, user } = useAuth();

  console.log("👤 Auth user:", user);

  if (session === undefined) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {user ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Idea Breakdown</h1>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <TreeVisualizer
            tree={{
              root: {
                id: 'placeholder',
                content: 'Your idea tree goes here',
                children: [],
                depth: 1,
                parentId: null
              },
              nodes: {}
            }}
            updateNode={() => {}}
            addChild={() => {}}
          />
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  );
}
