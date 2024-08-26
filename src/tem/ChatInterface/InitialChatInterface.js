import React, { useState } from 'react';
import { MessageSquare, User, Search, PlusCircle, Paperclip, Send, HelpCircle, ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/apiClient';

const InitialChatInterface = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                            <div className="p-2">
                                <div className="text-xs text-gray-500 mb-2 flex items-center">
                                    <Star className="w-4 h-4 mr-1" /> 收藏
                                </div>
                                {['AI 助手使用技巧', '编程最佳实践'].map((item, index) => (
                                    <div key={index} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-2">
                                <div className="text-xs text-gray-500 mb-2">今天</div>
                                {['ChatGPT 新功能探索', 'AI 在教育中的应用'].map((item, index) => (
                                    <div key={index} className="p-2 rounded-md hover:bg-gray-100 text-sm">{item}</div>
                                ))}
                            </div>
                            <div className="mt-4 p-2">
                                <div className="text-xs text-gray-500 mb-2">昨天</div>
                                {['极致翻译详解', 'Postgres Checkpoint Saver'].map((item, index) => (
                                    <div key={index} className="p-2 rounded-md hover:bg-gray-100 text-sm">{item}</div>
                                ))}
                            </div>
                            <div className="mt-4 p-2">
                                <div className="text-xs text-gray-500 mb-2">前 7 天</div>
                                {['Upsert Database Operation', 'ReAct代理概述'].map((item, index) => (
                                    <div key={index} className="p-2 rounded-md hover:bg-gray-100 text-sm">{item}</div>
                                ))}
                            </div>
                            <div className="mt-4 p-2">
                                <button className="flex items-center text-sm text-blue-500 hover:underline">
                                    View all <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
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
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        {response ? (
                            <div className="p-4">{response}</div>
                        ) : (
                            <>
                                <MessageSquare className="w-16 h-16 mx-auto mb-8 text-gray-300" />
                                <div className="grid grid-cols-2 gap-4 max-w-2xl">
                                    {[
                                        { icon: <MessageSquare className="w-6 h-6" />, title: '邀请朋友参加', description: '赠礼的消息' },
                                        { icon: <User className="w-6 h-6" />, title: '关于罗马帝国的趣事' },
                                        { icon: <MessageSquare className="w-6 h-6" />, title: '学习词汇' },
                                        { icon: <User className="w-6 h-6" />, title: '用于在新城市结交朋友的活动' }
                                    ].map((card, index) => (
                                        <div key={index} className="p-4 border rounded-md flex items-start">
                                            <div className="mr-3 text-gray-400">{card.icon}</div>
                                            <div className="text-left">
                                                <h3 className="font-semibold">{card.title}</h3>
                                                {card.description && <p className="text-sm text-gray-600">{card.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
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