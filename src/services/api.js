import axiosInstance from './apiClient';

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
    const response = await axiosInstance.get(`/chat/${sessionId}/`);
    return response.data;
  } catch (error) {
    console.error('API request failed', error);
    throw error;
  }
};

export const changeMessage = async (sessionId, messageUuid, newMessage = null) => {
  const endpoint = `/chat/${sessionId}/${messageUuid}`;
  console.log('Sending POST request to:', endpoint);
  
  const requestBody = newMessage ? { new_message: newMessage } : {};
  console.log('Request body:', requestBody);

  try {
    const response = await axiosInstance.post(endpoint, requestBody);
    return response.data;
  } catch (error) {
    console.error('API request failed', error);
    throw error;
  }
};