'use client';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <ClientProvider>
          <body>
            <Header />
            <ChatbotLayout />
            {children}
            <Footer />
          </body>
        </ClientProvider>
      </ReactQueryProvider>
    </html>
  );
}
