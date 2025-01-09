'use client';
import { useEffect, useState } from 'react';
import '@/styles/pages/chatbot/chatbot.scss';
import Link from 'next/link';

const LogoutChatBot = () => {
  const [position, setPosition] = useState({ x: 1450, y: 650 });
  const [isOpen, setIsOpen] = useState(false);
  const MOVE_THRESHOLD = 10;

  const toggleTextArea = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const yOffset = 70; // 하단에서의 오프셋
    const xOffset = 100;
    const handleResize = () => {
      const { innerHeight, innerWidth } = window;

      if (innerWidth > 767) {
        setPosition({ x: innerWidth - xOffset, y: innerHeight - yOffset });
      }
      if (innerWidth < 767) {
        setPosition({ x: innerWidth - xOffset + 20, y: innerHeight - yOffset + 10 });
      }
      if (innerWidth < 500) {
        setPosition({ x: innerWidth - xOffset + 40, y: innerHeight - yOffset + 20 });
      }
      if (innerWidth < 330) {
        setPosition({ x: innerWidth - xOffset + 60, y: innerHeight - yOffset + 25 });
      }
    };

    // 초기 호출
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    let draggingStatus = false;

    const handleMouseMove = (e: MouseEvent) => {
      const movedX = e.clientX - (position.x + offsetX);
      const movedY = e.clientY - (position.y + offsetY);
      const distance = Math.sqrt(movedX ** 2 + movedY ** 2);

      if (distance > MOVE_THRESHOLD) {
        draggingStatus = true;
      }
      setPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (!draggingStatus) {
        toggleTextArea();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="chatbot"
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y, position: 'fixed' }}
    >
      <div className="icon">💬</div>
      <div
        className={`chatbot-content_logout ${isOpen ? 'isOpen' : ''}`}
        style={{ right: 50, bottom: 40, position: 'absolute' }}
      >
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          GPT 기능은 &nbsp;
          <Link href="/login" className="logout-link">
            로그인
          </Link>{' '}
          &nbsp; 후 이용하실 수 있습니다.
        </div>
      </div>
    </div>
  );
};

export default LogoutChatBot;
