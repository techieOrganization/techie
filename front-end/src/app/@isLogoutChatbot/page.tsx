'use client';
import { useEffect, useState } from 'react';
import '@/styles/pages/chatbot/chatbot.scss';
import Link from 'next/link';

const LogoutChatBot = () => {
  const [position, setPosition] = useState({ x: 1850, y: 1000 });
  const [isOpen, setIsOpen] = useState(false);
  const MOVE_THRESHOLD = 10;

  const toggleTextArea = () => {
    setIsOpen((prev) => !prev);
  };

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

  useEffect(() => {
    const yOffset = 70; // 하단에서의 오프셋
    const xOffset = 90;
    const handleResize = () => {
      const { innerHeight, innerWidth } = window;

      if (innerWidth > 0) {
        setPosition({ x: innerWidth - xOffset, y: innerHeight - yOffset });
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
  return (
    <div
      className="chatbot"
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y, position: 'fixed' }}
    >
      <div className="icon">💬</div>
      <div
        className={`chatbot-content_logout ${isOpen ? 'isOpen' : ''}`}
        style={{ left: position.x - 380, top: position.y - 50, position: 'fixed' }}
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
