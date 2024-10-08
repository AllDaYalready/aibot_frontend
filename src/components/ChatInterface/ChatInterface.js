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
  const [originalMessages, setOriginalMessages] = useState([]); // Store original data
  const [latestMessageUuidInThread, setLatestMessageUuidInThread] = useState(null);
  const isSubmittingRef = useRef(false);
  const lastRequestIdRef = useRef(null);

  const findMessageByUuid = (messages, uuid) => {
    for (let message of messages) {
      if (message.message_uuid === uuid) {
        return message;
      }
      if (message.children) {
        const found = findMessageByUuid(message.children, uuid);
        if (found) return found;
      }
    }
    return null;
  };

  const findLatestMessage = (messages) => {
    let latestMessage = null;
    let latestTimestamp = 0;

    const traverse = (node) => {
      if (node.timestamp > latestTimestamp) {
        latestMessage = node;
        latestTimestamp = node.timestamp;
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    messages.forEach(traverse);
    return latestMessage;
  };

  const buildPathToRoot = (messages, startUuid) => {
    const path = [];
    let currentMessage = findMessageByUuid(messages, startUuid);

    while (currentMessage) {
      path.unshift(currentMessage);
      currentMessage = findMessageByUuid(messages, currentMessage.parent_uuid);
    }

    return path;
  };

  const processMessages = (messages, latestUuid) => {
    const latestMessage = findMessageByUuid(messages, latestUuid) || findLatestMessage(messages);
    if (!latestMessage) return [];

    const pathToRoot = buildPathToRoot(messages, latestMessage.message_uuid);
    const processedMessages = [];

    const traverse = (node, parent = null, siblingIndex = 0, siblings = []) => {
      const newMessage = {
        ...node,
        parent,
        siblingInfo: `${siblingIndex + 1}/${siblings.length || messages.length}`,
      };
      processedMessages.push(newMessage);

      if (node.children && node.children.length > 0) {
        const nextChild = pathToRoot.find(m => node.children.some(child => child.message_uuid === m.message_uuid)) || node.children[0];
        const nextChildIndex = node.children.findIndex(child => child.message_uuid === nextChild.message_uuid);
        traverse(nextChild, newMessage, nextChildIndex, node.children);
      }
    };

    const rootNode = pathToRoot[0];
    const rootIndex = messages.findIndex(m => m.message_uuid === rootNode.message_uuid);
    traverse(rootNode, null, rootIndex, messages);

    return processedMessages;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChatData(sessionId);
        console.log('Fetched chat data:', data);
        if (data.tree_data && data.latest_message_uuid_in_thread) {
          setOriginalMessages(data.tree_data); // Store the original tree data
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

  const handleSiblingChange = useCallback((index, direction) => {
    setDisplayedMessages(prevMessages => {
      const currentMessage = prevMessages[index];
      let siblings, newSiblingIndex;

      if (!currentMessage.parent) {
        // Handle root node using originalMessages to find all root nodes
        siblings = originalMessages.filter(m => m.parent_uuid === null);
        console.log('Filtered root node siblings from originalMessages:', siblings);
        newSiblingIndex = siblings.findIndex(m => m.message_uuid === currentMessage.message_uuid);
      } else {
        // Handle child nodes
        siblings = currentMessage.parent.children;
        console.log('Child node siblings:', siblings);
        newSiblingIndex = siblings.findIndex(sibling => sibling.message_uuid === currentMessage.message_uuid);
      }

      console.log('Current sibling index:', newSiblingIndex);

      if (direction === 'next') {
        newSiblingIndex++;
      } else if (direction === 'prev') {
        newSiblingIndex--;
      }

      console.log('New sibling index:', newSiblingIndex);

      if (newSiblingIndex < 0 || newSiblingIndex >= siblings.length) {
        console.warn('New sibling index out of bounds, no changes made.');
        return prevMessages;
      }

      const newSibling = siblings[newSiblingIndex];
      console.log('New sibling selected:', newSibling);

      const newMessages = prevMessages.slice(0, index);

      const traverse = (node, parent = null, siblingIndex = 0, siblings = []) => {
        console.log('Traversing node:', node);
        const newMessage = {
          ...node,
          parent,
          siblingInfo: `${siblingIndex + 1}/${siblings.length}`,
        };
        newMessages.push(newMessage);

        if (node.children && node.children.length > 0) {
          traverse(node.children[0], newMessage, 0, node.children);
        }
      };

      traverse(newSibling, currentMessage.parent, newSiblingIndex, siblings);

      console.log('New messages after traversal:', newMessages);
      return newMessages;
    });
  }, [originalMessages]); // Depend on originalMessages

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

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

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
