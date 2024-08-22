// src/components/ChatInterface.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import MessageNode from './MessageNode';

const ChatInterface = ({ sessionId }) => {
    const [messages, setMessages] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/message-tree/${sessionId}/`);
                console.log(response.data.tree_data);  // 添加这一行调试数据
                setMessages(response.data.tree_data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, [sessionId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <MessageSquare className="mr-2" />
                    <span className="font-semibold">ChatGPT 4o</span>
                </div>
            </div>
            {messages.map((message) => (
                <MessageNode key={message.message_uuid} node={message} />
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
