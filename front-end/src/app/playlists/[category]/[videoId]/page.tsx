'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useYouTubePlayer } from '@/hooks/memo/useYouTubePlayer';
import { useMemos } from '@/hooks/memo/useMemos';
import MemoList from '@/components/memo/MemoList';
import MemoForm from '@/components/memo/MemoForm';
import ConfirmModal from '@/components/memo/ConfirmModal';
import { fetchVideoDetails } from '@/app/api/videoAPIDetail';
import '@/styles/pages/playlist/playlist.scss';

const VideoPlayerPage: React.FC = () => {
  const { videoId } = useParams();
  const normalizedVideoId = Array.isArray(videoId) ? videoId[0] : videoId;
  const [videoDetails, setVideoDetails] = useState<{ title: string } | null>(null);

  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo !== null); // 로그인 상태 확인

  // Pass isLoggedIn to useMemos
  const { memoTime, handleAddMemo, seekToTime } = useYouTubePlayer({ videoId: normalizedVideoId });
  const { memos, hasMoreMemos, setCurrentPage, addMemo, updateMemoById, deleteMemoById } = useMemos(
    { videoId: normalizedVideoId, isLoggedIn },
  );

  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemo, setEditingMemo] = useState<{
    id: string;
    title: string;
    content: string;
    noteTime: string;
  } | null>(null);
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null);

  // 동영상 정보 가져오기
  useEffect(() => {
    const fetchVideoDetailsAsync = async () => {
      if (normalizedVideoId) {
        try {
          const details = await fetchVideoDetails(normalizedVideoId);
          setVideoDetails(details);
        } catch (error) {
          console.error('Failed to fetch video details:', error);
        }
      }
    };

    fetchVideoDetailsAsync();
  }, [normalizedVideoId]);

  // 메모 저장
  const handleSaveMemo = (title: string, content: string, noteTime: string) => {
    addMemo(title, content, noteTime);
    setIsAddingMemo(false);
  };

  // 메모 수정 저장
  const handleSaveEditedMemo = (title: string, content: string, noteTime: string) => {
    if (editingMemo) {
      updateMemoById(editingMemo.id, title, content, noteTime);
      setEditingMemo(null);
    }
  };

  // 메모 더 로드
  const loadMoreMemos = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // 메모 추가 클릭 시
  const handleAddMemoClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 시도하세요.');
      return;
    }

    handleAddMemo();
    setIsAddingMemo(true);
  };

  return (
    <div className="video_player_container">
      <div className="video_content">
        <h3 className="video_title">{videoDetails?.title}</h3>
        <div className="video_frame_and_memo">
          <div id="youtube-player" className="video_frame"></div>
          <div className="memo_container">
            <h4 className="save_memo_title">메모 목록</h4>
            <p>메모를 클릭하여 수정하거나 삭제할 수 있습니다.✏️</p>
            <p>내 전체 메모는 마이페이지에서 확인이 가능합니다.🍀</p>

            {/* 메모 리스트 */}
            <MemoList
              memos={memos}
              hasMoreMemos={hasMoreMemos}
              loadMoreMemos={loadMoreMemos}
              onEditMemo={(memo) => setEditingMemo(memo)}
              onDeleteMemo={(memoId) => setMemoToDelete(memoId)}
              onTimeClick={seekToTime}
            />

            {/* 메모 추가 또는 수정 */}
            {isAddingMemo ? (
              <MemoForm
                initialTitle=""
                initialContent=""
                initialTime={memoTime || '00:00'}
                onSave={handleSaveMemo}
                onCancel={() => setIsAddingMemo(false)}
              />
            ) : editingMemo ? (
              <MemoForm
                initialTitle={editingMemo.title}
                initialContent={editingMemo.content}
                initialTime={editingMemo.noteTime}
                onSave={handleSaveEditedMemo}
                onCancel={() => setEditingMemo(null)}
              />
            ) : (
              <button onClick={handleAddMemoClick} className="add_button">
                메모 추가
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {memoToDelete && (
        <ConfirmModal
          message="정말 삭제하시겠습니까?"
          onConfirm={() => {
            deleteMemoById(memoToDelete);
            setMemoToDelete(null);
          }}
          onCancel={() => setMemoToDelete(null)}
        />
      )}
    </div>
  );
};

export default VideoPlayerPage;
