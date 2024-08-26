import React from 'react';
import { useParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface/ChatInterface';
import useSessionData from '../hooks/useSessionData';

const ChatSessionPage = () => {
  const { sessionId } = useParams();
  const { treeData, loading, error } = useSessionData(sessionId);

  console.log('ChatSessionPage rendered. sessionId:', sessionId);
  console.log('treeData:', treeData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <ChatInterface initialMessages={treeData || []} />;
};

export default ChatSessionPage;