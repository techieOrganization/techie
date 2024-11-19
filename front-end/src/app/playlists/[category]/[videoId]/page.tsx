'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { fetchVideoDetails } from '@/app/api/videoAPIDetail';
import { saveMemo, deleteMemo, getMemosByVideo } from '@/app/api/memoAPI';
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAddingMemo, setIsAddingMemo] = useState(false);

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
    setEditIndex(null);
  };

  const handleAddMemo = () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      const formattedTime = formatTime(currentTime);

      console.log('Adding new memo at time (raw seconds):', currentTime);
      console.log('Formatted memo time:', formattedTime);

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

      // 저장 후 메모 목록 다시 가져오기
      const updatedResponse = await getMemosByVideo(videoId, 0);
      setMemos(updatedResponse.data.content);
    } catch (error) {
      console.error('Failed to save memo:', error);
    }

    resetMemo();
  };

  const handleEditMemo = (index: number) => {
    const memo = memos[index];
    console.log('Editing memo at index:', index, memo);

    if (!memo.noteTime) {
      console.error('Memo time is missing for the selected memo:', memo);
    }

    setMemoText(memo.content); // 메모 내용 설정
    setMemoTime(memo.noteTime || '00:00'); // 메모 시간 기본값 설정
    setEditIndex(index);
    setIsAddingMemo(true);
  };

  const handleDeleteMemo = async (index: number) => {
    const memoId = memos[index].id;

    if (!memoId) {
      console.warn('Memo ID is missing for deletion:', memos[index]);
      return;
    }

    try {
      console.log('Deleting memo with ID:', memoId);
      await deleteMemo(memoId);
      console.log('Memo deleted successfully.');
      setMemos((prevMemos) => prevMemos.filter((_, idx) => idx !== index));
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

  useEffect(() => {
    const fetchMemosForVideo = async () => {
      try {
        const response = await getMemosByVideo(videoId, 0);
        console.log('Fetched memos for video:', response.data.content); // 응답 데이터 확인
        setMemos(response.data.content);
      } catch (error) {
        console.error('Failed to fetch memos for video:', error);
      }
    };

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

    fetchMemosForVideo(); // 특정 동영상의 메모 가져오기
    fetchVideoDetailsAsync(); // 동영상 정보 가져오기

    console.log('useEffect triggered with videoId:', videoId);
  }, [videoId]);

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
                memos.map((memo, index) => (
                  <div key={memo.id || index} className="memo_item">
                    <span
                      className="memo_time"
                      onClick={() => {
                        console.log('Memo time clicked:', memo.noteTime);
                        handleTimeClick(memo.noteTime);
                      }}
                    >
                      {memo.noteTime || '시간 없음'}
                    </span>
                    <p className="memo_content">{memo.content || '내용 없음'}</p>
                    <div className="memo_actions">
                      <button onClick={() => handleEditMemo(index)}>수정</button>
                      <button onClick={() => handleDeleteMemo(index)}>삭제</button>
                    </div>
                  </div>
                ))
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
                    {editIndex !== null ? '메모 수정' : '메모 저장'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleAddMemo} className="add_memo_button">
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
