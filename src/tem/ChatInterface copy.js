import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Volume2, Copy, RefreshCw, ThumbsDown, Share2, PenTool, ChevronLeft, ChevronRight, Search, PlusCircle, HelpCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageInput from '../components/MessageInput/MessageInput';
import axiosInstance from '../services/apiClient';

const MessageNode = ({ message, turnNumber, siblingInfo, onSiblingChange }) => {
  const [currentIndex, totalSiblings] = siblingInfo.split('/').map(Number);

  return (
    <div className="mb-4" data-testid={`conversation-turn-${turnNumber}`}>
      <div className="text-xs text-gray-500 mb-1">Conversation Turn {turnNumber}</div>
      {message.message_type === 'Q' && (
        <div className="flex justify-end items-center mb-2">
          <PenTool size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <div className="bg-blue-100 p-3 rounded-lg">
            {message.message_content}
          </div>
        </div>
      )}
      {message.message_type === 'A' && (
        <div>
          <div className="bg-gray-100 p-3 rounded-lg mb-2">
            {message.message_content}
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm h-6">
            <div className="flex space-x-3">
              <Volume2 size={16} />
              <Copy size={16} />
              <RefreshCw size={16} />
              <ThumbsDown size={16} />
              <Share2 size={16} />
            </div>
            <div className="w-6"></div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
        <button
          onClick={() => onSiblingChange('prev')}
          disabled={currentIndex === 1}
          className="p-1 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span>{siblingInfo}</span>
        <button
          onClick={() => onSiblingChange('next')}
          disabled={currentIndex === totalSiblings}
          className="p-1 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const ChatInterface = ({ initialMessages }) => {
  const { sessionId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);
  const lastRequestIdRef = useRef(null);

  useEffect(() => {
    console.log('Session ID from URL:', sessionId);
    console.log('Initial messages received:', initialMessages);
    if (initialMessages && initialMessages.length > 0) {
      const traverseMessages = (node, path = []) => {
        const siblings = node.parent ? node.parent.children : [node];
        const siblingIndex = siblings.findIndex(sibling => sibling.message_uuid === node.message_uuid) + 1;

        const newMessage = {
          ...node,
          siblingInfo: `${siblingIndex}/${siblings.length}`,
          path: [...path]
        };

        setDisplayedMessages(prev => [...prev, newMessage]);

        if (node.children && node.children.length > 0) {
          traverseMessages(node.children[0], [...path, 0]);
        }
      };

      const addParentReferences = (node, parent = null) => {
        node.parent = parent;
        if (node.children) {
          node.children.forEach(child => addParentReferences(child, node));
        }
      };

      addParentReferences(initialMessages[0]);
      setDisplayedMessages([]);
      traverseMessages(initialMessages[0]);
    }
  }, [initialMessages, sessionId]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(async (message, requestId) => {
    console.log('Sending message:', message);
    console.log('Request ID:', requestId);

    if (isSubmittingRef.current) {
      console.log('A request is already in progress. Ignoring this submission.');
      return;
    }

    if (lastRequestIdRef.current === requestId) {
      console.log('Duplicate request detected. Ignoring this submission.');
      return;
    }

    isSubmittingRef.current = true;
    lastRequestIdRef.current = requestId;

    const lastMessageUuid = displayedMessages.length > 0 
      ? displayedMessages[displayedMessages.length - 1].message_uuid 
      : null;

    console.log('Last Message UUID:', lastMessageUuid);
    console.log('Session ID:', sessionId);

    try {
      const endpoint = sessionId ? `/chat/${sessionId}/` : '/chat/';
      console.log('Sending POST request to:', endpoint);
      console.log('Request body:', { chat_user_input: message, last_message_uuid: lastMessageUuid, request_id: requestId });

      const response = await axiosInstance.post(endpoint, {
        chat_user_input: message,
        last_message_uuid: lastMessageUuid,
        request_id: requestId
      });

      console.log('Server response:', response.data);

      if (response.data && response.data.status === 'success') {
        // 刷新页面
        window.location.reload();
      } else {
        console.error('Error: Unexpected response format', response.data);
        // 显示错误消息给用户
      }
    } catch (error) {
      console.error('Request failed', error);
      // 显示错误消息给用户
    } finally {
      isSubmittingRef.current = false;
    }
  }, [sessionId, displayedMessages]);

  const handleSiblingChange = useCallback((index, direction) => {
    setDisplayedMessages(prevMessages => {
      const currentMessage = prevMessages[index];
      const parentNode = currentMessage.parent;

      if (!parentNode) return prevMessages;

      const siblings = parentNode.children;
      let newSiblingIndex = siblings.findIndex(sibling => sibling.message_uuid === currentMessage.message_uuid);

      if (direction === 'next') {
        newSiblingIndex++;
      } else {
        newSiblingIndex--;
      }

      if (newSiblingIndex < 0 || newSiblingIndex >= siblings.length) {
        return prevMessages;
      }

      const newMessages = [...prevMessages.slice(0, index)];

      const traverseNewSibling = (node, path) => {
        const siblings = node.parent ? node.parent.children : [node];
        const siblingIndex = siblings.findIndex(sibling => sibling.message_uuid === node.message_uuid) + 1;

        const newMessage = {
          ...node,
          siblingInfo: `${siblingIndex}/${siblings.length}`,
          path: [...path]
        };
        newMessages.push(newMessage);

        if (node.children && node.children.length > 0) {
          traverseNewSibling(node.children[0], [...path, 0]);
        }
      };

      traverseNewSibling(siblings[newSiblingIndex], currentMessage.path);

      return newMessages;
    });
  }, []);

  console.log('ChatInterface - sessionId:', sessionId);
  console.log('ChatInterface - displayedMessages:', displayedMessages);

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} border-r flex flex-col transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b">
          <button onClick={toggleSidebar} className="p-1 hover:bg-gray-200 rounded">
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          {isSidebarOpen && (
            <>
              <div className="flex items-center flex-1 ml-2">
                <MessageSquare className="w-6 h-6 mr-2" />
                <span className="font-semibold">ChatGPT 4o</span>
              </div>
              <a href="#" className="p-1 hover:bg-gray-200 rounded" title="开始新聊天">
                <PlusCircle className="w-5 h-5 text-gray-600" />
              </a>
            </>
          )}
        </div>
        {isSidebarOpen && (
          <>
            <div className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索聊天"
                  className="w-full p-2 pl-8 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                />
                <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Chat history sections */}
            </div>
            <div className="p-4 border-t">
              <button className="w-full py-2 px-4 bg-gray-100 rounded-md text-sm flex items-center justify-center">
                <PlusCircle className="w-4 h-4 mr-2" />
                添加 Team 工作空间
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {displayedMessages.map((message, index) => (
            <MessageNode
              key={`${message.message_uuid}-${index}`}
              message={message}
              turnNumber={index + 1}
              siblingInfo={message.siblingInfo}
              onSiblingChange={(direction) => handleSiblingChange(index, direction)}
            />
          ))}
        </div>
        <MessageInput 
          onSendMessage={handleSendMessage} 
          sessionId={sessionId}
        />
      </div>
    </div>
  );
};

export default ChatInterface;