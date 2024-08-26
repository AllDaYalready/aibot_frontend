import { useState, useEffect } from 'react';
import { fetchChatData } from '../services/api';

const useSessionData = (sessionId) => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchChatData(sessionId);
        console.log('Fetched data:', data);
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

  return { treeData, loading, error };
};

export default useSessionData;