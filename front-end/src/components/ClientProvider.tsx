// ClientProvider.tsx
'use client'; // 클라이언트 컴포넌트로 설정

import { Provider } from 'react-redux';

import store from '@/redux/store';

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;
