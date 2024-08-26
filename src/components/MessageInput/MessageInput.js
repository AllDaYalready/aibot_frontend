import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Paperclip, Send, HelpCircle } from 'lucide-react';

const MessageInput = ({ onSendMessage, sessionId }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      
      // 当高度小于等于 88px (约两行) 时，隐藏滚动条
      if (newHeight <= 88) {
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.overflowY = 'auto';
      }
    }
  };

  const handleSend = useCallback(() => {
    if (message.trim() === '') return;

    const requestId = uuidv4();
    onSendMessage(message, requestId);
    setMessage('');
  }, [message, onSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="p-4 border-t">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              placeholder='给"ChatGPT"发送消息'
              className="w-full p-3 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition-all duration-200"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '200px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#E5E7EB transparent'
              }}
            />
            <Paperclip className="absolute right-[15px] top-3 text-gray-400" />
          </div>
          <button
            className="ml-2 p-3 bg-blue-500 rounded-md text-white hover:bg-blue-600"
            onClick={handleSend}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center mt-2 text-gray-500 flex items-center justify-center">
          ChatGPT 可能会犯错。请考虑验证重要信息。
          <HelpCircle className="w-4 h-4 ml-1" />
        </p>
      </div>
    </div>
  );
};

export default MessageInput;