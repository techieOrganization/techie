'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { fetchVideoDetails } from '@/app/api/videoAPIDetail';
import { saveMemo, updateMemo, deleteMemo } from '@/app/api/memoAPI';
import '@/styles/pages/playlist/playlist.scss';

interface VideoDetails {
  title: string;
  channelTitle: string;
}

interface Memo {
  id?: string;
  time: string;
  content: string;
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
  const isAddingMemoRef = useRef(isAddingMemo);

  useEffect(() => {
    loadYouTubeAPI(() => setIsYouTubeAPIReady(true));
  }, []);

  useEffect(() => {
    isAddingMemoRef.current = isAddingMemo;
  }, [isAddingMemo]);

  const handlePlayerStateChange = useCallback((event: YT.PlayerStateChangeEvent) => {
    if (event.data === YT.PlayerState.PAUSED && playerRef.current) {
      setMemoTime(formatTime(Math.floor(playerRef.current.getCurrentTime())));
    }
  }, []);

  useEffect(() => {
    if (isYouTubeAPIReady && videoId && !playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId as string,
        events: {
          onReady: () => {},
          onStateChange: handlePlayerStateChange,
        },
      });
    }
  }, [isYouTubeAPIReady, videoId, handlePlayerStateChange]);

  const formatTime = (seconds: number) => {
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

  const handleAddMemo = async () => {
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      try {
        const timeInSeconds = Math.floor(playerRef.current.getCurrentTime());
        setMemoTime(formatTime(timeInSeconds));
        setIsAddingMemo(true);
      } catch (error) {
        console.error('Error while getting current time:', error);
      }
    }
  };

  const handleTimeClick = (time: string) => {
    if (playerRef.current) {
      const [minutes, seconds] = time.split(':').map(Number);
      const timeInSeconds = minutes * 60 + seconds;
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const handleSaveMemo = async () => {
    if (!memoText.trim() || !memoTime) return;

    try {
      if (editIndex !== null) {
        const memoId = memos[editIndex].id;
        if (memoId) {
          const response = await updateMemo(memoId, { noteTime: memoTime, content: memoText });
          const updatedMemo = response.data;
          setMemos((prevMemos) =>
            prevMemos.map((memo, idx) => (idx === editIndex ? { ...updatedMemo } : memo)),
          );
        }
      } else {
        const response = await saveMemo({
          title: videoDetails?.title || '',
          content: memoText,
          noteTime: memoTime,
          videoId: videoId as string,
        });
        const savedMemo = response.data;
        setMemos((prevMemos) => [...prevMemos, savedMemo]);
      }
    } catch (error) {
      console.error('Failed to save memo:', error);
    }

    resetMemo();
  };

  const handleEditMemo = (index: number) => {
    setMemoText(memos[index].content);
    setEditIndex(index);
    setIsAddingMemo(true);
    setMemoTime(memos[index].time);
  };

  const handleDeleteMemo = async (index: number) => {
    const memoId = memos[index].id;

    try {
      if (memoId) {
        await deleteMemo(memoId);
      }
      setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  useEffect(() => {
    const fetchAllMemosByVideo = async () => {
      try {
        if (videoId) {
          const response = await fetch(`/api/memos/byVideo?vid=${videoId}`);
          const data = await response.json();
          setMemos(data);
        }
      } catch (error) {
        console.error('Failed to fetch memos for video:', error);
      }
    };

    const loadVideoDetails = async () => {
      if (videoId) {
        try {
          const details = await fetchVideoDetails(videoId as string);
          setVideoDetails(details);
        } catch (error) {
          console.error('Failed to fetch video details:', error);
        }
      }
    };

    fetchAllMemosByVideo();
    loadVideoDetails();
  }, [videoId]);

  return (
    <div className="video_player_container">
      <div className="video_content">
        <h3 className="video_title">{videoDetails?.title}</h3>
        <div className="video_frame_and_memo">
          <div id="youtube-player"></div>
          <div className="memo_container">
            <h4 className="save_memo_title">내 노트</h4>
            <p>메모 추가를 누르면 수업 내용을 간단히 메모할 수 있습니다.✏️</p>
            <div className="memo_save_content">
              {memos.map((memo, index) => (
                <div key={memo.id || index} className="memo_item">
                  <span className="memo_time" onClick={() => handleTimeClick(memo.time)}>
                    {memo.time}
                  </span>
                  <p className="memo_content">{memo.content}</p>
                  <div className="memo_actions">
                    <button className="edit_button" onClick={() => handleEditMemo(index)}>
                      수정
                    </button>
                    <button className="delete_button" onClick={() => handleDeleteMemo(index)}>
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {isAddingMemo ? (
                <div className="memo_bottom_content">
                  <div className="timer">{memoTime}</div>
                  <textarea
                    className="memo_input"
                    placeholder="메모를 입력하세요..."
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                  ></textarea>
                  <div className="actions">
                    <button className="cancel_button" onClick={resetMemo}>
                      취소
                    </button>
                    <button className="save_button" onClick={handleSaveMemo}>
                      {editIndex !== null ? '메모 수정' : '메모 저장'}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="add_button" onClick={handleAddMemo}>
                  메모 추가
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
