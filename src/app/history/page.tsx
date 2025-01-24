"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface HistoryItem {
  prompt: string;
  image_url: string;
  created_at: string;
}

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('https://sundai-backend-103058721915.us-east4.run.app/history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comic History</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
        >
          Back to Generator
        </button>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm">
              <img 
                src={item.image_url} 
                alt={item.prompt}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-sm text-gray-600 mb-2">{item.prompt}</p>
              <p className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}