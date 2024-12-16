import React from 'react';
import '@/styles/common/common.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/pages/chatbot/chatbot.scss';
import ChatbotLayout from '@/components/ChatbotLayout';
import ClientProvider from '@/components/ClientProvider';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Techie',
  description: '테키와 함께 유튜브 강의를 보며 메모하고, GPT와 함께 학습을 더 효율적으로 해보세요!',
  openGraph: {
    title: 'Techie',
    description:
      '테키와 함께 유튜브 강의를 보며 메모하고, GPT와 함께 학습을 더 효율적으로 해보세요!',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClientProvider>
            <Header />
            <ChatbotLayout />
            {children}
            <Footer />
          </ClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
