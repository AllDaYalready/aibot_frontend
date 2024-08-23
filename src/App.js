import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';

const ChatSession = () => {
  const { sessionId } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId || sessionId === 'undefined') {
        console.error('Invalid sessionId:', sessionId);
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching data for session:', sessionId);
        const response = await fetch(`http://127.0.0.1:8000/api/msgt/${sessionId}/`);
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response text:', text);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(text);
        console.log('Parsed data:', data);
        setTreeData(data.tree_data);
      } catch (e) {
        console.error('Error fetching chat data:', e);
        setError(`Failed to load chat data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!treeData) return <div>No data available</div>;

  console.log('Rendering ChatInterface with treeData:', treeData);
  return <ChatInterface initialMessages={treeData} />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chat/:sessionId" element={<ChatSession />} />
        <Route path="/" element={<Navigate to="/chat/default" replace />} />
      </Routes>
    </Router>
  );
};

export default App;