import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { EmailEditor } from './components/EmailEditor';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'dashboard'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-4 font-medium ${
                activeTab === 'editor'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              Email Editor
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? <Dashboard /> : <EmailEditor />}
    </div>
  );
}

export default App;