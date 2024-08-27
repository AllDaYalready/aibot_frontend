import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InitialChatInterface from './ChatInterface/InitialChatInterface';
import ChatInterface from '../components/ChatInterface/ChatInterface';

const ChatSession = () => {
  const { sessionId } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // // 获取 CSRF token 的请求
  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     try {
  //       await fetch('http://127.0.0.1:8000/api/csrf-token/', {
  //         method: 'GET',
  //         credentials: 'include', // 允许跨域发送 cookie
  //       });
  //       console.log('CSRF token fetched');
  //     } catch (error) {
  //       console.error('Error fetching CSRF token:', error);
  //     }
  //   };

  //   fetchCsrfToken();
  // }, []);






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
        const response = await fetch(`http://127.0.0.1:8000/api/chat/${sessionId}/`, {
          credentials: 'include', // 允许跨域发送 cookie
        });
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

  // 使用条件渲染，根据是否有 treeData 或其他条件决定渲染哪个组件
  if (treeData) {
    return <ChatInterface initialMessages={treeData} />;
  } else {
    return <InitialChatInterface />;
  }
};

export default ChatSession;
