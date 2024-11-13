import '@/styles/common/common.scss';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/styles/pages/chatbot/chatbot.scss';
import ChatbotLayout from '@/components/ChatbotLayout';
import ClientProvider from '@/components/ClientProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientProvider>
        <body>
          <Header />
          <ChatbotLayout />
          {children}
          <Footer />
        </body>
      </ClientProvider>
    </html>
  );
}
