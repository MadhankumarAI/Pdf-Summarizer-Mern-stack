import { useState, useEffect } from 'react';
import api from '../api/axios';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/history');
        setHistory(response.data);
      } catch (err) {
        setError('// ERROR: DATABASE_CONNECTION_FAILED');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-white font-syne">Archives</h1>
          <p className="text-gray-500 mt-2 text-sm">Past analysis logs and retrieved documents.</p>
        </div>
      </div>

      {isLoading && <div className="text-[#ccff00] font-mono animate-pulse">Loading data streams...</div>}
      {error && <div className="text-red-500 font-mono text-sm border border-red-900/50 bg-red-900/10 p-4 rounded">{error}</div>}

      {!isLoading && !error && history.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
          <p className="text-gray-500 font-mono">No records found in database.</p>
        </div>
      )}

      {!isLoading && !error && history.length > 0 && (
        <div className="glass-panel rounded-xl overflow-hidden animate-slide-up delay-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-mono uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-medium">Filename</th>
                  <th className="py-4 px-6 font-medium">Synopsis</th>
                  <th className="py-4 px-6 font-medium">Timestamp</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6 font-medium text-white group-hover:text-[#ccff00] transition-colors">
                      {item.filename}
                    </td>
                    <td className="py-4 px-6 text-gray-400 max-w-xs truncate">
                      {item.summary}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors">
                        Retrieve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;