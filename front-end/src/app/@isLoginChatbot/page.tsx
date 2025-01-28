'use client';
import { useEffect, useState } from 'react';
import '@/styles/pages/chatbot/chatbot.scss';
import fetchChatBot from '../api/chatBotApi';
import Cookies from 'js-cookie';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
import { devConsoleError } from '@/utils/logger';

const Chatbot = () => {
  const [position, setPosition] = useState({ x: 1850, y: 1000 });
  const [isOpen, setIsOpen] = useState(false);
  const [textarea, setTextarea] = useState('');
  const [loading, setLoading] = useState(false);
  const [gptlog, setGptlog] = useState<{ user: string; bot: string }[]>([]);
  const MOVE_THRESHOLD = 10;

  // const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const toggleTextArea = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const yOffset = 70; // 하단에서의 오프셋
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

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
  };

  const token = Cookies.get('token');

  const handleSubmit = async () => {
    if (!textarea) return;
    if (!token) return;
    try {
      setLoading(true);

      const newLogEntry = { user: textarea, bot: '' };
      setGptlog((prev) => [...prev, newLogEntry]);
      const apiResponse = await fetchChatBot({ request: textarea, token: token });
      // typeResponse(apiResponse.response);

      setGptlog((prev) =>
        prev.map((log, index) =>
          index === prev.length - 1 ? { ...log, bot: apiResponse.response } : log,
        ),
      );
      setTextarea('');
    } catch (error) {
      devConsoleError('함수요청 오류', error);
    } finally {
      setLoading(false);
    }
  };

  // const typeResponse = (text: string) => {
  //   setGptResponse('');
  //   let index = -1;
  //   const interval = setInterval(() => {
  //     if (index < text.length - 1) {
  //       setGptResponse((prev) => prev + text[index]);
  //       index++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 50);
  // };

  const keyDownEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
      e.preventDefault();
    }
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
        <div className="chatbot-response" onMouseDown={(e) => e.stopPropagation()}>
          <div className="log-container">
            {gptlog.map((log, index) => (
              <div className="chatbot-log" key={`${log.user}-${index}`}>
                {/* {userInfo?.nickname} */}
                <span className="user-req">{log.user}</span>
                Techie
                <span className="bot-res">
                  {loading && index === gptlog.length - 1
                    ? 'Techie 가 답변을 준비중이에요!..'
                    : log.bot}
                </span>
              </div>
            ))}
          </div>
        </div>
        <textarea
          value={textarea}
          onChange={handleTextArea}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Techie 에게 물어보세요!"
          onKeyDown={keyDownEnter}
        ></textarea>
        <button onMouseDown={(e) => e.stopPropagation()} onClick={handleSubmit}>
          →
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
