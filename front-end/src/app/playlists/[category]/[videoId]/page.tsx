'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { fetchVideoDetails } from '@/app/api/videoAPIDetail';
import { saveMemo, updateMemo, deleteMemo, getMemosByVideo } from '@/app/api/memoAPI';
import '@/styles/pages/playlist/playlist.scss';

interface VideoDetails {
  title: string;
  channelTitle: string;
}

interface Memo {
  id?: string;
  noteTime: string;
  content: string;
  videoId: string;
}

const loadYouTubeAPI = (onReady: () => void) => {
  if (!window.YT) {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      onReady();
    };
  } else {
    onReady();
  }
};

const VideoPlayerPage: React.FC = () => {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [memoTime, setMemoTime] = useState<string | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [isAddingMemo, setIsAddingMemo] = useState(false);

  // 메모별 수정 내용을 저장하기 위한 상태
  const [editedMemoContent, setEditedMemoContent] = useState('');
  const [editedMemoTime, setEditedMemoTime] = useState<string | null>(null);

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMemos, setHasMoreMemos] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    loadYouTubeAPI(() => setIsYouTubeAPIReady(true));
  }, []);

  const handlePlayerStateChange = useCallback((event: YT.PlayerStateChangeEvent) => {
    if (event.data === YT.PlayerState.PAUSED && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime
        ? Math.floor(playerRef.current.getCurrentTime())
        : 0;
      const formattedTime = formatTime(currentTime);

      console.log('Paused at time (seconds):', currentTime);
      console.log('Formatted memo time:', formattedTime);

      setMemoTime(formattedTime); // 일시정지 시간 설정
    }
  }, []);

  useEffect(() => {
    if (isYouTubeAPIReady && videoId && !playerRef.current) {
      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: videoId as string,
          events: {
            onStateChange: handlePlayerStateChange,
          },
        });
      } catch (error) {
        console.error('Failed to initialize YouTube Player:', error);
      }
    }
  }, [isYouTubeAPIReady, videoId, handlePlayerStateChange]);

  const formatTime = (seconds: number): string => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  const resetMemo = () => {
    setMemoText('');
    setIsAddingMemo(false);
    setMemoTime(null);
  };

  const handleAddMemo = () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      const formattedTime = formatTime(currentTime);

      setMemoTime(formattedTime); // 유튜브에서 가져온 시간 설정
      setIsAddingMemo(true);
    } else {
      console.error('Player is not initialized. Cannot add memo.');
    }
  };

  const handleSaveMemo = async () => {
    if (!memoText.trim() || !memoTime) {
      console.warn('Memo text or time is missing:', { memoText, memoTime });
      return;
    }

    try {
      const payload = {
        title: videoDetails?.title || '',
        content: memoText,
        noteTime: memoTime || '00:00', // noteTime 기본값 설정
        videoId,
      };

      console.log('Saving new memo with payload:', payload);
      const response = await saveMemo(payload);
      console.log('Saved memo response:', response.data);

      // 메모를 저장한 후 첫 페이지부터 다시 로드
      setCurrentPage(0);
      setMemos([]);
      setHasMoreMemos(true);
    } catch (error) {
      console.error('Failed to save memo:', error);
    }

    resetMemo();
  };

  const handleEditMemo = (memo: Memo) => {
    console.log('Editing memo:', memo);

    setEditingMemoId(memo.id || null);
    setEditedMemoContent(memo.content);
    setEditedMemoTime(memo.noteTime || '00:00');
  };

  const handleCancelEdit = () => {
    setEditingMemoId(null);
    setEditedMemoContent('');
    setEditedMemoTime(null);
  };

  const handleSaveEditedMemo = async (memoId: string) => {
    if (!editedMemoContent.trim() || !editedMemoTime) {
      console.warn('Edited memo text or time is missing:', {
        editedMemoContent,
        editedMemoTime,
      });
      return;
    }

    try {
      const payload = {
        noteTime: editedMemoTime || '00:00',
        content: editedMemoContent,
      };
      console.log('Updating memo with ID:', memoId, 'and payload:', payload);
      const response = await updateMemo(memoId, payload);
      console.log('Updated memo response:', response.data);

      // 메모를 수정한 후 첫 페이지부터 다시 로드
      setCurrentPage(0);
      setMemos([]);
      setHasMoreMemos(true);
    } catch (error) {
      console.error('Failed to update memo:', error);
    }

    handleCancelEdit();
  };

  const handleDeleteMemo = async (memoId: string) => {
    if (!memoId) {
      console.warn('Memo ID is missing for deletion');
      return;
    }

    try {
      console.log('Deleting memo with ID:', memoId);
      await deleteMemo(memoId);
      console.log('Memo deleted successfully.');

      // 메모를 삭제한 후 첫 페이지부터 다시 로드
      setCurrentPage(0);
      setMemos([]);
      setHasMoreMemos(true);
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  const handleTimeClick = (time: string | undefined) => {
    if (!time) {
      console.error('Time is missing for memo');
      return;
    }

    if (playerRef.current?.seekTo) {
      const [minutes, seconds] = time.split(':').map(Number); // 시간 분리
      playerRef.current.seekTo(minutes * 60 + seconds, true); // 해당 시간으로 이동
    } else {
      console.error('Player is not initialized.');
    }
  };

  const fetchMemosForVideo = useCallback(
    async (page: number) => {
      try {
        const response = await getMemosByVideo(videoId, page);

        setMemos((prevMemos) => [...prevMemos, ...response.data.content]);

        // 마지막 페이지인지 확인
        const isLastPage = response.data.last;
        setHasMoreMemos(!isLastPage);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 404) {
          setMemos([]);
          setHasMoreMemos(false);
        } else {
          console.error('Failed to fetch memos for video:', axiosError);
        }
      }
    },
    [videoId],
  );

  useEffect(() => {
    fetchMemosForVideo(currentPage);
  }, [currentPage, fetchMemosForVideo]);

  useEffect(() => {
    const fetchVideoDetailsAsync = async () => {
      if (videoId) {
        try {
          const details = await fetchVideoDetails(videoId as string);
          setVideoDetails(details);
        } catch (error) {
          console.error('Failed to fetch video details:', error);
        }
      }
    };

    fetchVideoDetailsAsync();
  }, [videoId]);

  const lastMemoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreMemos) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMoreMemos],
  );

  return (
    <div className="video_player_container">
      <div className="video_content">
        <h3 className="video_title">{videoDetails?.title}</h3>
        <div className="video_frame_and_memo">
          <div id="youtube-player" className="video_frame"></div>
          <div className="memo_container">
            <h4 className="save_memo_title">메모 목록</h4>
            <p>메모를 클릭하여 수정하거나 삭제할 수 있습니다.</p>
            <div className="memo_list">
              {memos.length > 0 ? (
                memos.map((memo, index) => {
                  const isLastMemo = memos.length === index + 1;
                  return (
                    <div
                      key={memo.id}
                      className="memo_item"
                      ref={isLastMemo ? lastMemoElementRef : null}
                    >
                      <span
                        className="memo_time"
                        onClick={() => {
                          console.log('Memo time clicked:', memo.noteTime);
                          handleTimeClick(memo.noteTime);
                        }}
                      >
                        {memo.noteTime || '시간 없음'}
                      </span>
                      {editingMemoId === memo.id ? (
                        // 편집 중인 메모
                        <div className="memo_edit_form">
                          <textarea
                            value={editedMemoContent}
                            onChange={(e) => setEditedMemoContent(e.target.value)}
                            className="memo_input"
                          ></textarea>
                          <div className="memo_actions">
                            <button onClick={() => handleSaveEditedMemo(memo.id!)}>저장</button>
                            <button onClick={handleCancelEdit}>취소</button>
                          </div>
                        </div>
                      ) : (
                        // 일반 메모
                        <>
                          <p className="memo_content">{memo.content || '내용 없음'}</p>
                          <div className="memo_actions">
                            <button onClick={() => handleEditMemo(memo)}>수정</button>
                            <button onClick={() => handleDeleteMemo(memo.id!)}>삭제</button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>메모가 없습니다. 메모를 추가해보세요!</p>
              )}
            </div>

            {isAddingMemo ? (
              <div className="memo_form">
                <div className="memo_time_display">{memoTime}</div>
                <textarea
                  placeholder="메모를 입력하세요"
                  value={memoText}
                  className="memo_input"
                  onChange={(e) => setMemoText(e.target.value)}
                ></textarea>
                <div className="form_actions">
                  <button className="cancel_button" onClick={resetMemo}>
                    취소
                  </button>
                  <button className="save_button" onClick={handleSaveMemo}>
                    메모 저장
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleAddMemo} className="add_button">
                메모 추가
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
