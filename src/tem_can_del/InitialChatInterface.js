import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/apiClient';
import Sidebar from '../components/Layout/Sidebar/Sidebar';
import MainContent from '../components/MainContent/MainContent';
import MessageInput from '../components/MessageInput/MessageInput';

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
            await axiosInstance.get('/csrf-token/');
            console.log('CSRF token fetched successfully');

            const res = await axiosInstance.post('chat/', {
                chat_user_input: message,
            });

            if (res.data.status === 'success') {
                setResponse(res.data.last_message);
                setMessage('');
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
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <div className="flex-1 flex flex-col">
                <MainContent response={response} />
                <MessageInput 
                    message={message}
                    setMessage={setMessage}
                    handleMessageSend={handleMessageSend}
                />
            </div>
        </div>
    );
};

export default InitialChatInterface;