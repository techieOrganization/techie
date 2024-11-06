// app/playlists/[category]/[videoId]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchVideoDetails } from '@/libs/api/videoAPI2';
import '@/styles/pages/playlist/playlist.scss';

interface Memo {
  time: string;
  content: string;
  id?: string;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayerPage: React.FC = () => {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState<{ title: string; channelTitle: string } | null>(
    null,
  );
  const [memoText, setMemoText] = useState('');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  // 유튜브 API 로드 및 플레이어 초기화
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onload = () => {
        window.onYouTubeIframeAPIReady = initializePlayer;
      };
      document.body.appendChild(script);
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId as string,
        events: {
          onStateChange: handlePlayerStateChange,
        },
      });
    };

    loadYouTubeAPI();
  }, [videoId]);

  // 유튜브 동영상 상태 변경 핸들러
  const handlePlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PAUSED && playerRef.current) {
      const timeInSeconds = Math.floor(playerRef.current.getCurrentTime());
      setCurrentTime(formatTime(timeInSeconds));
    }
  };

  // 시간 형식 변환 함수 (초 -> 분:초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 메모 저장 핸들러
  const handleSaveMemo = () => {
    if (memoText.trim()) {
      if (editIndex !== null) {
        // 수정 모드
        const updatedMemos = [...memos];
        updatedMemos[editIndex] = { time: currentTime, content: memoText };
        setMemos(updatedMemos);
        setEditIndex(null);
      } else {
        // 새로운 메모 추가
        setMemos((prevMemos) => [...prevMemos, { time: currentTime, content: memoText }]);
      }
      setMemoText('');
    }
  };

  // 메모 수정 핸들러
  const handleEditMemo = (index: number) => {
    setMemoText(memos[index].content);
    setEditIndex(index);
  };

  // 메모 삭제 핸들러
  const handleDeleteMemo = (index: number) => {
    setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
  };

  // 시간 클릭 시 해당 시간으로 이동
  const handleTimeClick = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    playerRef.current?.seekTo(timeInSeconds, true);
    playerRef.current?.playVideo();
  };

  // 비디오 세부 정보 불러오기
  useEffect(() => {
    const loadVideoDetails = async () => {
      if (videoId) {
        const details = await fetchVideoDetails(videoId);
        setVideoDetails(details);
      }
    };
    loadVideoDetails();
  }, [videoId]);

  return (
    <div className="video_player_container">
      <div className="video_content">
        <h3 className="video_title">{videoDetails?.title}</h3>
        <div className="video_frame_and_memo">
          <div id="youtube-player"></div>
          <div className="memo_container">
            <h4 className="save_memo_title">저장된 메모</h4>
            <div className="memo_save_content">
              {memos.map((memo, index) => (
                <div key={index} className="memo_item">
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
              <div className="memo_bottom_content">
                <div className="timer">{currentTime}</div>
                <textarea
                  className="memo_input"
                  placeholder="메모를 입력하세요..."
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                ></textarea>
                <div className="actions">
                  <button className="cancel_button" onClick={() => setMemoText('')}>
                    취소
                  </button>
                  <button className="save_button" onClick={handleSaveMemo}>
                    {editIndex !== null ? '메모 수정' : '메모 저장'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
