'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { fetchVideoDetails } from '@/app/api/videoAPIDetail';
// import { saveMemo, updateMemo, deleteMemo, getMemo, getAllMemos } from '@/app/api/memoAPI';
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
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = onReady;
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

  // YouTube API 초기화 및 로드
  useEffect(() => {
    loadYouTubeAPI(() => setIsYouTubeAPIReady(true));
  }, []);

  // API가 로드된 후 YouTube Player 초기화

  useEffect(() => {
    isAddingMemoRef.current = isAddingMemo;
  }, [isAddingMemo]);

  const handlePlayerStateChange = useCallback((event: YT.OnStateChangeEvent) => {
    if (!isAddingMemoRef.current && event.data === YT.PlayerState.PAUSED && playerRef.current) {
      setMemoTime(formatTime(Math.floor(playerRef.current.getCurrentTime())));
    }
  }, []);

  useEffect(() => {
    if (isYouTubeAPIReady && videoId && !playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId as string,
        events: { onStateChange: handlePlayerStateChange },
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

  // 메모 추가 핸들러
  const handleAddMemo = async () => {
    if (playerRef.current) {
      const timeInSeconds = Math.floor(playerRef.current.getCurrentTime());
      setMemoTime(formatTime(timeInSeconds));
      setIsAddingMemo(true);
    }
  };

  const handleTimeClick = (time: string) => {
    if (playerRef.current) {
      const [minutes, seconds] = time.split(':').map(Number); // "분:초" 형식의 시간을 분리
      const timeInSeconds = minutes * 60 + seconds; // 분과 초를 합쳐서 초 단위로 변환
      playerRef.current.seekTo(timeInSeconds, true); // YouTube 플레이어의 해당 시간으로 이동
    }
  };

  const handleSaveMemo = async () => {
    if (!memoText.trim() || !memoTime) return;

    const newMemo = { time: memoTime, content: memoText };

    if (editIndex !== null) {
      /*
      if (memoId) {
        try {
        //⭐ 메모 수정시, 백엔드 전달 정보
          await updateMemo(memoId, { noteTime: memoTime, content: memoText }); // memoAPI에서 PUT 사용
          setMemos((prevMemos) =>
            prevMemos.map((memo, idx) => (idx === editIndex ? { ...memo, ...newMemo } : memo))
          );
        } catch (error) {
          console.error("Failed to update memo:", error);
        }
      }
      */

      setMemos((prevMemos) =>
        prevMemos.map((memo, idx) => (idx === editIndex ? { ...memo, ...newMemo } : memo)),
      );
    } else {
      /*
      try {
      //⭐ 메모 추가시, 백엔드 전달 정보
        const response = await saveMemo({
          title: 무슨 제목이 들어와야할까요?🌻,
          content: memoText,
          noteTime: memoTime,
        }); 
        const savedMemo = response.data;
        setMemos((prevMemos) => [...prevMemos, { ...newMemo, id: savedMemo.id }]);
      } catch (error) {
        console.error("Failed to add memo:", error);
      }
      */

      setMemos((prevMemos) => [...prevMemos, newMemo]);
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
    // const memoId = memos[index].id;

    /*
    if (memoId) {
      try {
        await deleteMemo(memoId); // memoAPI에서 DELETE 사용
        setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Failed to delete memo:", error);
      }
    }
    */

    setMemos((prevMemos) => prevMemos.filter((_, i) => i !== index));
  };

  // const handleFetchMemo = async (memoId: string) => {
  //   /*
  //   try {
  //     const response = await getMemo(memoId); // memoAPI에서 GET 사용
  //     const memo = response.data;
  //     // 필요 시 memo를 처리하는 추가 로직
  //   } catch (error) {
  //     console.error("Failed to fetch memo:", error);
  //   }
  //   */
  // };

  // const fetchAllMemos = async () => {
  //   /*
  //   try {
  //     const response = await getAllMemos(); // memoAPI에서 전체 메모 GET 사용
  //     setMemos(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch all memos:", error);
  //   }
  //   */
  // };

  // useEffect(() => {
  //   fetchAllMemos();
  // }, []);

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
