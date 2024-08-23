import React, { useState } from 'react';
import { ChevronDown, MessageSquare, User, Search, PlusCircle, Paperclip, Send, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const InitialChatInterface = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMessageSend = async () => {
        if (message.trim() === '') return;


        try {
            const response = await fetch('http://localhost:8000/api/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chat_user_input: message }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setResponse(data.last_message);
                setMessage(''); // 清空输入框
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar and other UI components here */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        {/* 显示消息 */}
                        {response && <div className="p-4">{response}</div>}
                    </div>
                </div>
                <div className="p-4 border-t">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder='给"ChatGPT"发送消息'
                                    className="w-full p-3 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <button className="ml-2 p-3 bg-blue-500 rounded-md text-white" onClick={handleMessageSend}>
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-center mt-2 text-gray-500 flex items-center justify-center">
                            ChatGPT 可能会犯错。请考虑验证重要信息。
                            <HelpCircle className="w-4 h-4 ml-1" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialChatInterface;
