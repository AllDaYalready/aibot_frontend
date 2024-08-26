import axiosInstance from './apiClient';
import apiClient from './apiClient';

export const sendMessage = async (sessionId, message, lastMessageUuid, requestId) => {
  const endpoint = sessionId ? `/chat/${sessionId}/` : '/chat/';
  console.log('Sending POST request to:', endpoint);
  console.log('Request body:', { chat_user_input: message, last_message_uuid: lastMessageUuid, request_id: requestId });

  try {
    const response = await axiosInstance.post(endpoint, {
      chat_user_input: message,
      last_message_uuid: lastMessageUuid,
      request_id: requestId
    });

    return response.data;
  } catch (error) {
    console.error('API request failed', error);
    throw error;
  }
};

export const fetchChatData = async (sessionId) => {
    try {
      const response = await apiClient.get(`/chat/${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  };