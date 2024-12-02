import React, { useState } from 'react';

interface MemoFormProps {
  initialContent?: string;
  initialTime?: string;
  onSave: (content: string, noteTime: string) => void;
  onCancel: () => void;
}

const MemoForm: React.FC<MemoFormProps> = ({
  initialContent = '',
  initialTime = '00:00',
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="memo_form">
      <div className="memo_time_display">{initialTime}</div>
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
        <button className="save_button" onClick={() => onSave(content, initialTime)}>
          저장
        </button>
      </div>
    </div>
  );
};

export default MemoForm;
