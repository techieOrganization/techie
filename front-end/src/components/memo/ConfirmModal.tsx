import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal_content">
        <p>{message}</p>
        <div className="modal_actions">
          <button className="cancel_button" onClick={onCancel}>
            취소
          </button>
          <button className="save_button" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
