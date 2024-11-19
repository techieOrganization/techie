'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import '@/styles/pages/playlist/playlist.scss';

interface CategoryPlaylistProps {
  category: string;
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query'); // 검색어 가져오기
  const router = useRouter();

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        if (searchQuery) {
          // 검색어가 있는 경우
          data = await fetchVideosByCategory({ query: searchQuery });
        } else {
          // 카테고리 기반 데이터 호출
          data = await fetchVideosByCategory({ category });
        }
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('비디오를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [category, searchQuery]);

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
          <h3 className="search_result">{searchQuery ? `검색 결과: '${searchQuery}'` : ''}</h3>
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p className="error_message">{error}</p>
          ) : videos.length > 0 ? (
            <ul className="video_list">
              {videos.map((video, index) => (
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
              ))}
            </ul>
          ) : (
            <p>결과를 찾을 수 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPlaylist;
