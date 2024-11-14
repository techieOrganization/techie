'use client';

import { usePathname } from 'next/navigation';

import ChatBot from '@/app/@isLoginChatbot/page';
import LogoutChatBot from '@/app/@isLogoutChatbot/page';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ConditionalChatBot = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo !== null);
  const pathname = usePathname();
  const isExclude = pathname === '/login' || pathname === '/signup';

  // 특정 경로가 아닐 경우 챗봇 렌더링
  if (isExclude) {
    return null; // 특정 경로에서는 챗봇을 표시하지 않음
  }

  // 로그인 상태에 따라 챗봇 컴포넌트 선택
  return isLoggedIn ? <ChatBot /> : <LogoutChatBot />;
};

export default ConditionalChatBot;
