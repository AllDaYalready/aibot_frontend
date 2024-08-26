import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar/Sidebar';
import MessageTree from './MessageTree';
import MessageInput from '../MessageInput/MessageInput';
import { sendMessage } from '../../services/api';

const ChatInterface = ({ initialMessages }) => {
  const { sessionId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const isSubmittingRef = useRef(false);
  const lastRequestIdRef = useRef(null);

  useEffect(() => {
    console.log('Initial messages received:', initialMessages);
    if (initialMessages && initialMessages.length > 0) {
      const processMessages = (messages) => {
        const processedMessages = [];
        const traverse = (node, parent = null, siblingIndex = 0, siblings = []) => {
          const newMessage = {
            ...node,
            parent,
            siblingInfo: `${siblingIndex + 1}/${siblings.length}`,
          };
          processedMessages.push(newMessage);

          if (node.children && node.children.length > 0) {
            node.children.forEach((child, index) => {
              traverse(child, newMessage, index, node.children);
            });
          }
        };

        traverse(messages[0], null, 0, [messages[0]]);
        return processedMessages;
      };

      const processed = processMessages(initialMessages);
      console.log('Processed messages:', processed);
      setDisplayedMessages(processed);
    }
  }, [initialMessages]);

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
          node.children.forEach((child, childIndex) => {
            traverse(child, newMessage, childIndex, node.children);
          });
        }
      };

      traverse(siblings[newSiblingIndex], currentMessage.parent, newSiblingIndex, siblings);

      console.log('Updated messages after sibling change:', newMessages);
      return newMessages;
    });
  }, []);

  console.log('Rendering ChatInterface with displayedMessages:', displayedMessages);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        {displayedMessages.length > 0 ? (
          <MessageTree
            messages={displayedMessages}
            onSiblingChange={handleSiblingChange}
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