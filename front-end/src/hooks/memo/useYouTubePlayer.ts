import { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '@/utils/memo/timeUtils';

interface UseYouTubePlayerProps {
  videoId: string;
}

export const useYouTubePlayer = ({ videoId }: UseYouTubePlayerProps) => {
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false);
  const [memoTime, setMemoTime] = useState<string | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  // YouTube API 로드
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => {
          setIsYouTubeAPIReady(true);
        };
      } else {
        setIsYouTubeAPIReady(true);
      }
    };

    loadYouTubeAPI();
  }, []);

  const handlePlayerStateChange = useCallback((event: YT.PlayerStateChangeEvent) => {
    if (event.data === YT.PlayerState.PAUSED && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime
        ? Math.floor(playerRef.current.getCurrentTime())
        : 0;
      const formattedTime = formatTime(currentTime);

      setMemoTime(formattedTime);
    }
  }, []);

  // YouTube 플레이어 초기화
  useEffect(() => {
    if (isYouTubeAPIReady && videoId && !playerRef.current) {
      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId,
          events: {
            onStateChange: handlePlayerStateChange,
          },
        });
      } catch (error) {
        console.error('Failed to initialize YouTube Player:', error);
      }
    }
  }, [isYouTubeAPIReady, videoId, handlePlayerStateChange]);

  const handleAddMemo = () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      const formattedTime = formatTime(currentTime);

      setMemoTime(formattedTime);
    } else {
      console.error('Player is not initialized. Cannot add memo.');
    }
  };

  const seekToTime = (time: string) => {
    if (playerRef.current?.seekTo) {
      const [minutes, seconds] = time.split(':').map(Number);
      playerRef.current.seekTo(minutes * 60 + seconds, true);
    } else {
      console.error('Player is not initialized.');
    }
  };

  return { memoTime, handleAddMemo, seekToTime };
};
