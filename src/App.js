import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ChatSession from './components/ChatSession';
import InitialChatInterface from './components/InitialChatInterface';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 处理 /chat/ 路由 */}
        <Route path="/chat" element={<InitialChatInterface />} />

        {/* 渲染 ChatSession 组件，处理 /chat/:sessionId 路由 */}
        <Route path="/chat/:sessionId" element={<ChatSession />} />

        {/* 默认重定向到 /chat/ */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
