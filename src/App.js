import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InitialChatPage from './pages/InitialChatPage';
import ChatSessionPage from './pages/ChatSessionPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 处理 /chat/ 路由 */}
        <Route path="/chat" element={<InitialChatPage />} />

        {/* 渲染 ChatSessionPage 组件，处理 /chat/:sessionId 路由 */}
        <Route path="/chat/:sessionId" element={<ChatSessionPage />} />

        {/* 默认重定向到 /chat/ */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
};

export default App;