import React, { useState } from 'react';
import { Paperclip, Send, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import axiosInstance from '../../axiosInstance';

const InitialChatInterface = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const navigate = useNavigate(); // 获取 navigate 函数

    const handleMessageSend = async () => {
        if (message.trim() === '') return;

        try {
            // 先获取 CSRF token
            await axiosInstance.get('/csrf-token/');
            console.log('CSRF token fetched successfully');

            const res = await axiosInstance.post('chat/', {
                chat_user_input: message,
            });

            if (res.data.status === 'success') {
                setResponse(res.data.last_message);
                setMessage(''); // 清空输入框

                // 更新 URL，无刷新跳转到带 session_id 的页面
                navigate(`/chat/${res.data.session_id}`, { replace: true });
            } else {
                console.error('Error:', res.data.message);
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
