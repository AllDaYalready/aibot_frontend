import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MessageInput from '../../MessageInput/MessageInput';

const ChatLayout = ({ children, onSendMessage, isSidebarOpen, onToggleSidebar }) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onToggle={onToggleSidebar} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatLayout;