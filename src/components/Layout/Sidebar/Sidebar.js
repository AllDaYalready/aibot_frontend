import React from 'react';
import { MessageSquare, Search, PlusCircle, ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} border-r flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b">
        <button onClick={onToggle} className="p-1 hover:bg-gray-200 rounded">
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {isOpen && (
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
      {isOpen && (
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
            <SidebarSection title="收藏" icon={<Star className="w-4 h-4 mr-1" />}>
              {['AI 助手使用技巧', '编程最佳实践'].map((item, index) => (
                <SidebarItem key={index} icon={<Star className="w-4 h-4 mr-2 text-yellow-400" />}>
                  {item}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="今天">
              {['ChatGPT 新功能探索', 'AI 在教育中的应用'].map((item, index) => (
                <SidebarItem key={index}>{item}</SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="昨天">
              {['极致翻译详解', 'Postgres Checkpoint Saver'].map((item, index) => (
                <SidebarItem key={index}>{item}</SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="前 7 天">
              {['Upsert Database Operation', 'ReAct代理概述'].map((item, index) => (
                <SidebarItem key={index}>{item}</SidebarItem>
              ))}
            </SidebarSection>
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
  );
};

const SidebarSection = ({ title, icon, children }) => (
  <div className="mt-4 p-2">
    <div className="text-xs text-gray-500 mb-2 flex items-center">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const SidebarItem = ({ icon, children }) => (
  <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
    {icon}
    <span className="text-sm">{children}</span>
  </div>
);

export default Sidebar;