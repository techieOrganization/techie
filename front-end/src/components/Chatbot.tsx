'use client';
import { useState } from 'react';
import '@/styles/pages/chatbot/chatbot.scss';

const Chatbot = () => {
  const [position, setPosition] = useState({ x: 1450, y: 650 });
  const [isOpen, setIsOpen] = useState(false);
  const [textarea, setTextarea] = useState('');
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

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
  };

  return (
    <div
      className="chatbot"
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y, position: 'fixed' }}
    >
      <div className="icon">💬</div>
      <div
        className={`chatbot-content ${isOpen ? 'isOpen' : ''}`}
        style={{ left: position.x - 620, top: position.y - 200, position: 'fixed' }}
      >
        <div className="chatbot-response" onMouseDown={(e) => e.stopPropagation()}>
          챗봇응답
        </div>
        <textarea
          value={textarea}
          onChange={handleTextArea}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        ></textarea>
        <button onMouseDown={(e) => e.stopPropagation()}>➡️</button>
      </div>
    </div>
  );
};

export default Chatbot;
