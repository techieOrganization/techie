'use client';
import { useEffect, useState } from 'react';
import Chatlog from '@/components/chatbot/chatLog';

const Chatbot = () => {
  const [position, setPosition] = useState({ x: 1850, y: 1000 });
  const [isOpen, setIsOpen] = useState(false);

  const MOVE_THRESHOLD = 10;

  const toggleTextArea = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const yOffset = 70;
    const xOffset = 90;
    const handleResize = () => {
      const { innerHeight, innerWidth } = window;

      setPosition({ x: innerWidth - xOffset, y: innerHeight - yOffset });
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
        className={`chatbot-content_login ${isOpen ? 'isOpen' : ''}`}
        style={{ left: position.x - 580, top: position.y - 400, position: 'fixed' }}
      >
        <Chatlog />

      </div>
    </div>
  );
};

export default Chatbot;
