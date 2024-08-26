import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatLayout from '../components/Layout/MainLayout/ChatLayout';
import SuggestedPrompts from '../components/Layout/MainLayout/SuggestedPrompts';
import apiClient from '../services/apiClient';

const InitialChatPage = () => {
  const [response, setResponse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSendMessage = async (message, requestId) => {
    if (message.trim() === '') return;

    try {
      const res = await apiClient.post('chat/', {
        chat_user_input: message,
        request_id: requestId
      });

      if (res.data.status === 'success') {
        setResponse(res.data.last_message);
        navigate(`/chat/${res.data.session_id}`, { replace: true });
      } else {
        console.error('Error:', res.data.message);
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  return (
    <ChatLayout 
      onSendMessage={handleSendMessage}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={toggleSidebar}
    >
      {response ? (
        <div className="p-4">{response}</div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <SuggestedPrompts />
        </div>
      )}
    </ChatLayout>
  );
};

export default InitialChatPage;