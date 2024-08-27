import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar/Sidebar';
import MessageTree from './MessageTree';
import MessageInput from '../MessageInput/MessageInput';
import { sendMessage, changeMessage, fetchChatData } from '../../services/api';

const ChatInterface = () => {
  const { sessionId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [latestMessageUuidInThread, setLatestMessageUuidInThread] = useState(null);
  const isSubmittingRef = useRef(false);
  const lastRequestIdRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChatData(sessionId);
        console.log('Fetched chat data:', data);
        if (data.tree_data && data.latest_message_uuid_in_thread) {
          setLatestMessageUuidInThread(data.latest_message_uuid_in_thread);
          const processed = processMessages(data.tree_data, data.latest_message_uuid_in_thread);
          setDisplayedMessages(processed);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };
    fetchData();
  }, [sessionId]);

  const processMessages = (messages, latestUuid) => {
    const processedMessages = [];
    const traverse = (node, parent = null, siblingIndex = 0, siblings = []) => {
      const newMessage = {
        ...node,
        parent,
        siblingInfo: `${siblingIndex + 1}/${siblings.length}`,
      };
      processedMessages.push(newMessage);

      if (node.children && node.children.length > 0) {
        const nextChild = node.message_uuid === latestUuid 
          ? node.children[node.children.length - 1]  // 如果是最新消息，选择最后一个子节点
          : node.children[0];  // 否则选择第一个子节点
        const nextChildIndex = node.children.indexOf(nextChild);
        traverse(nextChild, newMessage, nextChildIndex, node.children);
      }
    };

    traverse(messages[0], null, 0, [messages[0]]);
    return processedMessages;
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(async (message, requestId) => {
    console.log('Attempting to send message:', message);
    console.log('Request ID:', requestId);

    if (isSubmittingRef.current || lastRequestIdRef.current === requestId) {
      console.log('Request in progress or duplicate. Ignoring.');
      return;
    }

    isSubmittingRef.current = true;
    lastRequestIdRef.current = requestId;

    const lastMessageUuid = displayedMessages.length > 0
      ? displayedMessages[displayedMessages.length - 1].message_uuid
      : null;

    try {
      console.log('Sending message to API...');
      const response = await sendMessage(sessionId, message, lastMessageUuid, requestId);
      console.log('Server response:', response);

      if (response && response.status === 'success') {
        console.log('Message sent successfully, refreshing page...');
        window.location.reload();
      } else {
        console.error('Error: Unexpected response format', response);
        // 显示错误消息给用户
      }
    } catch (error) {
      console.error('Request failed', error);
      // 显示错误消息给用户
    } finally {
      isSubmittingRef.current = false;
      lastRequestIdRef.current = null;
    }
  }, [sessionId, displayedMessages]);

  const handleSiblingChange = useCallback((index, direction) => {
    setDisplayedMessages(prevMessages => {
      const currentMessage = prevMessages[index];
      if (!currentMessage.parent) return prevMessages;

      const siblings = currentMessage.parent.children;
      let newSiblingIndex = siblings.findIndex(sibling => sibling.message_uuid === currentMessage.message_uuid);

      if (direction === 'next') {
        newSiblingIndex++;
      } else {
        newSiblingIndex--;
      }

      if (newSiblingIndex < 0 || newSiblingIndex >= siblings.length) {
        return prevMessages;
      }

      const newMessages = prevMessages.slice(0, index);
      const traverse = (node, parent = null, siblingIndex = 0, siblings = []) => {
        const newMessage = {
          ...node,
          parent,
          siblingInfo: `${siblingIndex + 1}/${siblings.length}`,
        };
        newMessages.push(newMessage);

        if (node.children && node.children.length > 0) {
          const nextChild = node.message_uuid === latestMessageUuidInThread 
            ? node.children[node.children.length - 1]
            : node.children[0];
          const nextChildIndex = node.children.indexOf(nextChild);
          traverse(nextChild, newMessage, nextChildIndex, node.children);
        }
      };

      traverse(siblings[newSiblingIndex], currentMessage.parent, newSiblingIndex, siblings);

      console.log('Updated messages after sibling change:', newMessages);
      return newMessages;
    });
  }, [latestMessageUuidInThread]);

  const handleChangeMessage = useCallback(async (messageUuid, newMessage) => {
    try {
      const response = await changeMessage(sessionId, messageUuid, newMessage);
      if (response && response.status === 'success') {
        // 刷新页面
        window.location.reload();
      } else {
        console.error('Error: Unexpected response format', response);
        // 显示错误消息给用户
      }
    } catch (error) {
      console.error('Error changing message:', error);
      // 显示错误消息给用户
    }
  }, [sessionId]);

  const handleRegenerateAnswer = useCallback(async (messageUuid) => {
    try {
      const response = await changeMessage(sessionId, messageUuid);
      if (response && response.status === 'success') {
        // 刷新页面
        window.location.reload();
      } else {
        console.error('Error: Unexpected response format', response);
        // 显示错误消息给用户
      }
    } catch (error) {
      console.error('Error regenerating answer:', error);
      // 显示错误消息给用户
    }
  }, [sessionId]);

  console.log('Rendering ChatInterface with displayedMessages:', displayedMessages);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        {displayedMessages.length > 0 ? (
          <MessageTree
            messages={displayedMessages}
            latestMessageUuidInThread={latestMessageUuidInThread}
            onSiblingChange={handleSiblingChange}
            onChangeMessage={handleChangeMessage}
            onRegenerateAnswer={handleRegenerateAnswer}
          />
        ) : (
          <div>No messages to display</div>
        )}
        <MessageInput
          onSendMessage={handleSendMessage}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
};

export default ChatInterface;