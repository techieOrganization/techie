"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { fetchVideoById } from '@/libs/api/youtubeService';

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      const fetchVideo = async () => {
        try {
          const videoData = await fetchVideoById(videoId);
          setVideo(videoData);
        } catch (error) {
          console.error('Failed to fetch video detail:', error); 
        } finally {
          setLoading(false);
        }
      };

      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!video) {
    return <p>No video data found</p>;
  }

  const handleGoBack = () => {
    router.push('/youtube');
  };

  return (
    <div className='vid'>
      <div className="inner">
        <h2 className='title'>강의 상세</h2>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
          title={video.snippet.title}
        ></iframe>
        <h3>{video.snippet.title}</h3>
        <p>채널: {video.snippet.channelTitle}</p>
        <button onClick={handleGoBack}>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default VideoDetailPage;
