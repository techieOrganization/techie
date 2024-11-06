'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchVideosByCategory } from '@/libs/api/videoAPI';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import '@/styles/pages/playlist/playlist.scss';

interface CategoryPlaylistProps {
  category: string;
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadVideos = async () => {
      const data = await fetchVideosByCategory(category);
      setVideos(data);
    };
    loadVideos();
  }, [category]);

  const handleCategoryClick = (newCategory: string) => {
    router.push(`/playlists/${newCategory}`);
  };

  return (
    <div className="playlists_container">
      <div className="inner">
        <ul className="dev_list">
          {vidListData.map((tab) => (
            <li key={tab.id}>
              <button type="button" onClick={() => handleCategoryClick(tab.id)}>
                <Image src={tab.img} alt={tab.title} width={40} height={40} />
                <span>{tab.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="video_list">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index} className="video_item">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={video.thumbnails.medium.url}
                    alt={video.title}
                    width={video.thumbnails.medium.width}
                    height={video.thumbnails.medium.height}
                  />
                  <h3>{video.title}</h3>
                  <p>{video.channelTitle}</p>
                  <p>{new Date(video.publishedAt).toLocaleDateString()}</p>
                </a>
              </div>
            ))
          ) : (
            <p>해당 카테고리의 영상을 불러오는 중입니다...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPlaylist;
