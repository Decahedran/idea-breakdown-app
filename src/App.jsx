import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import TreeVisualizer from './components/TreeVisualizer'; // placeholder for now

export default function App() {
  const { session, user } = useAuth(); // ✅ we need both session and user

  console.log("👤 Auth user:", user);

  if (session === undefined) {
    return <div className="p-6 text-center">Loading...</div>; // ✅ wait for session to resolve
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">Idea Breakdown</h1>
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
