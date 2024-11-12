'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';

import { fetchVideosByCategory } from '@/libs/api/videoAPI';
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
      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <li key={index} className="video_item">
                  <Link href={`/playlists/${category}/${video.videoId}`}>
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                    />
                    <h3 className="title">{video.title}</h3>
                    <p className="channel_title">{video.channelTitle}</p>
                    <p className="date">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </Link>
                </li>
              ))
            ) : (
              <p>해당 카테고리의 영상을 불러오는 중입니다...</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryPlaylist;
