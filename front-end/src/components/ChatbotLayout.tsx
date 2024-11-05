'use client';

import { usePathname } from 'next/navigation';
import ChatBot from '@/components/Chatbot';

const ConditionalChatBot = () => {
  const pathname = usePathname();
  const isExclude = pathname === '/login' || pathname === '/signup';

  return !isExclude ? <ChatBot /> : null;
};

export default ConditionalChatBot;
