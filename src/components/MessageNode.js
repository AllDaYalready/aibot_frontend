// src/components/MessageNode.js
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Copy, RefreshCw, ThumbsDown, Share2, PenTool } from 'lucide-react';

const MessageNode = ({ node }) => {
    const [currentIndex, setCurrentIndex] = useState(0);


    if (!node) {
        return null;  // 如果没有节点数据，返回空内容，防止错误
    }

    const nextMessage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % node.children.length);
    };

    const prevMessage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + node.children.length) % node.children.length);
    };

    return (
        <div className="mb-4">
            {node.message_type === 'Q' && (
                <div className="flex justify-end items-center mb-2">
                    <PenTool size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <div className="bg-blue-100 p-3 rounded-lg">
                        {node.message_content}
                    </div>
                </div>
            )}
            {node.message_type === 'A' && (
                <div>
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                        {node.message_content}
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-sm h-6">
                        <div className="flex space-x-3">
                            <Volume2 size={16} />
                            <Copy size={16} />
                            <RefreshCw size={16} />
                            <ThumbsDown size={16} />
                            <Share2 size={16} />
                        </div>
                        <div className="w-6"></div> {/* Placeholder for </> */}
                    </div>
                </div>
            )}
            {node.children && node.children.length > 0 && (
                <div className="mt-2 ml-4">
                    {node.children.length > 1 && (
                        <div className="flex items-center justify-end text-sm text-gray-500 mb-2">
                            <button onClick={prevMessage} className="p-1"><ChevronLeft size={16} /></button>
                            <span>{currentIndex + 1}/{node.children.length}</span>
                            <button onClick={nextMessage} className="p-1"><ChevronRight size={16} /></button>
                        </div>
                    )}
                    <MessageNode node={node.children[currentIndex]} />
                </div>
            )}
        </div>
    );
};

export default MessageNode;
