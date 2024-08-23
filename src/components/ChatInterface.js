import React, { useState, useEffect } from 'react';
import { MessageSquare, Volume2, Copy, RefreshCw, ThumbsDown, Share2, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [displayedMessages, setDisplayedMessages] = useState([]);

  useEffect(() => {
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
  }, [initialMessages]);

  const handleSiblingChange = (index, direction) => {
    setDisplayedMessages(prevMessages => {
      const currentMessage = prevMessages[index];
      const parentNode = currentMessage.parent;
      
      if (!parentNode) return prevMessages; // Root node, can't change

      const siblings = parentNode.children;
      let newSiblingIndex = siblings.findIndex(sibling => sibling.message_uuid === currentMessage.message_uuid);
      
      if (direction === 'next') {
        newSiblingIndex++;
      } else {
        newSiblingIndex--;
      }

      if (newSiblingIndex < 0 || newSiblingIndex >= siblings.length) {
        return prevMessages; // Invalid sibling index, do nothing
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
  };

  console.log('Displayed messages:', displayedMessages);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <MessageSquare className="mr-2" />
          <span className="font-semibold">ChatGPT 4o</span>
        </div>
      </div>
      {displayedMessages.map((message, index) => (
        <MessageNode
          key={`${message.message_uuid}-${index}`}
          message={message}
          turnNumber={index + 1}
          siblingInfo={message.siblingInfo}
          onSiblingChange={(direction) => handleSiblingChange(index, direction)}
        />
      ))}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder='给"ChatGPT"发送消息'
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <MessageSquare size={20} className="text-gray-400" />
        </button>
      </div>
      <p className="text-xs text-center mt-2 text-gray-500">
        ChatGPT 也可能会犯错。请核查重要信息。
      </p>
    </div>
  );
};

export default ChatInterface;