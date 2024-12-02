import React, { useState } from 'react';

interface MemoFormProps {
  initialTitle?: string; // 제목 초기값
  initialContent?: string; // 내용 초기값
  initialTime?: string; // 메모 시간 초기값
  onSave: (title: string, content: string, noteTime: string) => void;
  onCancel: () => void;
}

const MemoForm: React.FC<MemoFormProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTime = '00:00',
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <div className="memo_form">
      <div className="memo_time_display">{initialTime}</div>
      <input
        type="text"
        placeholder="메모 제목을 입력하세요. (선택 항목)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="memo_title_input"
      />
      <textarea
        placeholder="메모를 입력하세요"
        value={content}
        className="memo_input"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="form_actions">
        <button className="cancel_button" onClick={onCancel}>
          취소
        </button>
        <button className="save_button" onClick={() => onSave(title, content, initialTime)}>
          저장
        </button>
      </div>
    </div>
  );
};

export default MemoForm;
