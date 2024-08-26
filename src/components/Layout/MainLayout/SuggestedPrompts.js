import React from 'react';
import { MessageSquare, User } from 'lucide-react';

const SuggestedPrompts = () => {
  const prompts = [
    { icon: <MessageSquare className="w-6 h-6" />, title: '邀请朋友参加', description: '赠礼的消息' },
    { icon: <User className="w-6 h-6" />, title: '关于罗马帝国的趣事' },
    { icon: <MessageSquare className="w-6 h-6" />, title: '学习词汇' },
    { icon: <User className="w-6 h-6" />, title: '用于在新城市结交朋友的活动' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      {prompts.map((prompt, index) => (
        <div key={index} className="p-4 border rounded-md flex items-start">
          <div className="mr-3 text-gray-400">{prompt.icon}</div>
          <div className="text-left">
            <h3 className="font-semibold">{prompt.title}</h3>
            {prompt.description && <p className="text-sm text-gray-600">{prompt.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedPrompts;