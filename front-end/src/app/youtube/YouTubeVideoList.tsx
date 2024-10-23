'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchVideosByIds } from '@/libs/api/youtubeService';

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
      maxres?: {
        url: string;
      };
    };
  };
}

interface YouTubeVideoListProps {
  videoIds: string[];
}

const YouTubeVideoList: React.FC<YouTubeVideoListProps> = ({ videoIds }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await fetchVideosByIds(videoIds);
        setVideos(videoData);
      } catch (error) {
        console.error('Failed to fetch videos by IDs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [videoIds]);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  return (
    <div className="vid">
      {videos.map((video) => (
        <div key={video.id}>
          <Link href={`/youtube/${video.id}`} className="vid_cont">
          <Image 
              src={video.snippet.thumbnails.maxres ? video.snippet.thumbnails.maxres.url : video.snippet.thumbnails.high.url} 
              alt={video.snippet.title} 
              width={320}
              height={180}
              layout="responsive" 
            />
            <h3>{video.snippet.title}</h3>
            <p>채널: {video.snippet.channelTitle}</p>
            <p>업로드 날짜: {new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default YouTubeVideoList;
