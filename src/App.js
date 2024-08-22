// src/App.js
import React from 'react';
import ChatInterface from './components/ChatInterface';

export default function App() {
  // const sessionId = "your-session-id";  // 替换为实际的 session ID
  const sessionId = "f4234c40-234d-46d0-9a84-979b30590e03"
  return <ChatInterface sessionId={sessionId} />;
}
