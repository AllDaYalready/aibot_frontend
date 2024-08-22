// src/App.js
import React from 'react';
import ChatInterface from './components/ChatInterface';

export default function App() {
  // const sessionId = "your-session-id";  // 替换为实际的 session ID
  const sessionId = "a422e93f-8637-477d-8ddf-d1c27c3203dc"
  return <ChatInterface sessionId={sessionId} />;
}
