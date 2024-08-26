import React from 'react';
import MessageNode from './MessageNode';

const MessageTree = ({ messages, onSiblingChange }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <MessageNode
          key={`${message.message_uuid}-${index}`}
          message={message}
          turnNumber={index + 1}
          siblingInfo={message.siblingInfo}
          onSiblingChange={(direction) => onSiblingChange(index, direction)}
        />
      ))}
    </div>
  );
};

export default MessageTree;