import { useState } from 'react';
import { devConsoleError } from '@/utils/logger';
import fetchChatBot from '../../app/api/chatBotApi';
import '@/styles/pages/chatbot/chatbot.scss';
import Cookies from 'js-cookie';
const Chatlog = () => {
  const [gptlog, setGptlog] = useState<{ user: string; bot: string }[]>([]);
  const [textarea, setTextarea] = useState('');
  const [loading, setLoading] = useState(false);

  // api 요청 함수
  const handleSubmit = async () => {
    const token = Cookies.get('token');
    if (!textarea) return;
    if (!token) return;
    try {
      setLoading(true);

      // 새 요청시 설정된 문구 이후에 응답값을 받아오면 그 값으로 대체
      const newLogEntry = { user: textarea, bot: '' };
      setGptlog((prev) => [...prev, newLogEntry]);
      const apiResponse = await fetchChatBot({ request: textarea, token: token });

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

  // 키보드 이벤트 'Enter'
  const keyDownEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
      e.preventDefault();
    }
  };
  // textarea 입력 이벤트
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
  };

  return (
    <>
      <div className="chatbot-response" onMouseDown={(e) => e.stopPropagation()}>
        <div className="log-container">
          {gptlog.map((log, index) => (
            <div className="chatbot-log" key={`${log.user}-${index}`}>
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
    </>
  );
};

export default Chatlog;
