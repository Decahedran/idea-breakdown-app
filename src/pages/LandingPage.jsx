import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { session, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (session && user) {
      navigate('/dashboard');
    }
  }, [session, user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Visual Project Planner</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Organize your ideas visually. Break them down step-by-step. Start for free, upgrade anytime.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-purple-600 font-semibold px-6 py-2 rounded shadow hover:bg-gray-100"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-purple-600"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg mb-2">Visual Breakdown</h3>
            <p>Turn complex projects into simple, actionable layers.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Unlimited Depth</h3>
            <p>Break tasks down up to 6 levels deep for unmatched clarity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Export Friendly</h3>
            <p>Export your project as JSON or PDF anytime.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">Simple Pricing</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
            <p className="text-gray-600 mb-4">Manage 1 project for free forever.</p>
            <p className="text-3xl font-bold mb-6">$0</p>
            <ul className="text-left mb-6">
              <li>✔ 1 Project</li>
              <li>✔ Full Visual Editor</li>
              <li>✔ Export Tools</li>
            </ul>
            <button
              onClick={() => navigate('/signup')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              Get Started
            </button>
          </div>
          <div className="border rounded-lg p-6 shadow-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-gray-600 mb-4">For power users who want unlimited projects.</p>
            <p className="text-3xl font-bold mb-6">$5<span className="text-base font-normal">/month</span></p>
            <ul className="text-left mb-6">
              <li>✔ Unlimited Projects</li>
              <li>✔ Early Feature Access</li>
              <li>✔ Priority Support</li>
            </ul>
            <button
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Visual Project Planner. All rights reserved.
      </footer>
    </div>
  );
}
