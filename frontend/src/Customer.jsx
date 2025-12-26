import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';

const Customer = ({ user }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/history?userId=${user._id}`);
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };
    fetchHistory();
  }, [user]);

  const getSentimentCounts = (item) => {
    if (!item) return { positive: 0, negative: 0, neutral: 0 };

    const positiveCount = item.positiveKeywords?.length || 0;
    const negativeCount = item.negativeKeywords?.length || 0;
    const neutralCount = Math.max(0,
      (item.transcript?.split(' ').length || 0) - positiveCount - negativeCount
    );

    return {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount
    };
  };

  return (
    <main className="lg:ml-20 ml-0 min-h-[calc(100vh-64px)] bg-gray-50 p-4 pb-24 lg:pb-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        <p className="text-sm text-gray-600 mt-1">A log of all sentiment analysis performed on calls.</p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mt-4 bg-white p-4 !rounded-xl shadow-sm border border-gray-200 shadow-md hover:shadow-xl transition-shadow" data-aos="fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-2">Caller Name</th>
                  <th scope="col" className="px-4 py-2">Time</th>
                  <th scope="col" className="px-4 py-2">Positive</th>
                  <th scope="col" className="px-4 py-2">Negative</th>
                  <th scope="col" className="px-4 py-2">Neutral</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => {
                  const counts = getSentimentCounts(item);
                  return (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <th scope="row" className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {item.callerName || 'Unknown'}
                      </th>
                      <td className="px-4 py-2">{new Date(item.date).toLocaleString()}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">{counts.positive}</td>
                      <td className="px-4 py-2 text-red-600 font-semibold">{counts.negative}</td>
                      <td className="px-4 py-2 text-yellow-600 font-semibold">{counts.neutral}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Customer;