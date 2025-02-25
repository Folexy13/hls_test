
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Articles() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="md:max-w-7xl w-11/12 mx-auto">
        <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Articles</h1>
          <p className="text-gray-600">Articles page content goes here.</p>
        </div>
      </div>
    </div>
  );
}

export default Articles;