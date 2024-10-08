import React, { useState } from 'react';
import { Volume2, Copy, RefreshCw, ThumbsDown, Share2, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';

const MessageNode = ({ message, turnNumber, siblingInfo, onSiblingChange, onChangeMessage, onRegenerateAnswer }) => {
  const [currentIndex, totalSiblings] = siblingInfo.split('/').map(Number);
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handlePenToolClick = () => {
    setIsEditing(true);
    setNewMessage(message.message_content);
  };

  const handleSubmitNewMessage = (e) => {
    e.preventDefault();
    onChangeMessage(message.message_uuid, newMessage);
    setIsEditing(false);
  };

  const handleRefreshClick = () => {
    onRegenerateAnswer(message.message_uuid);
  };

  return (
    <div className="mb-4" data-testid={`conversation-turn-${turnNumber}`}>
      <div className="text-xs text-gray-500 mb-1">Conversation Turn {turnNumber}</div>
      {message.message_type === 'Q' && (
        <div className="flex justify-end items-center mb-2">
          <PenTool 
            size={16} 
            className="text-gray-400 mr-2 flex-shrink-0 cursor-pointer" 
            onClick={handlePenToolClick}
          />
          <div className="bg-blue-100 p-3 rounded-lg">
            {isEditing ? (
              <form onSubmit={handleSubmitNewMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 rounded border"
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Submit</button>
              </form>
            ) : (
              message.message_content
            )}
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
              <RefreshCw size={16} className="cursor-pointer" onClick={handleRefreshClick} />
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

export default MessageNode;