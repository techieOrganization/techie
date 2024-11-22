'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import '@/styles/pages/playlist/playlist.scss';

interface CategoryPlaylistProps {
  category: string;
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category: initialCategory }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  // API 호출 함수
  const loadVideos = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchVideosByCategory({ category, query, page: currentPage });

        // API 응답의 'last' 값을 사용하여 hasMore 상태 업데이트
        setHasMore(!data.last);

        // 중복된 비디오 제거 후 상태 업데이트
        setVideos((prevVideos) => [
          ...prevVideos,
          ...data.content.filter(
            (newVideo) => !prevVideos.some((oldVideo) => oldVideo.videoId === newVideo.videoId),
          ),
        ]);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('비디오를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [category, query],
  );

  // 카테고리 또는 검색어 변경 시 초기화 및 데이터 로드
  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0);
  }, [category, query, loadVideos]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (page > 0) {
      loadVideos(page);
    }
  }, [page, loadVideos]);

  // 카테고리 변경 처리
  const handleCategoryClick = (newCategory: string) => {
    if (newCategory === category) return;

    setCategory(newCategory);
    router.push(`/playlists/${newCategory}?query=${encodeURIComponent(query)}`);
  };

  // IntersectionObserver를 사용한 무한 스크롤
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.1 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // 옵저버 정리
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <div className="playlists_container">
      <ul className="dev_list">
        {vidListData.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              onClick={() => handleCategoryClick(tab.id)}
              disabled={tab.id === category}
            >
              <Image src={tab.img} alt={tab.title} width={40} height={40} />
              <span>{tab.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="video_list_cont">
        <div className="inner">
          {loading && videos.length === 0 && <p>로딩 중...</p>}
          {error && <p className="error_message">{error}</p>}
          <ul className="video_list">
            {videos.map((video, index) => {
              const isLastVideo = index === videos.length - 1;
              return (
                <li
                  key={video.videoId}
                  className="video_item"
                  ref={isLastVideo ? lastVideoElementRef : null}
                >
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
              );
            })}
          </ul>
          {loading && page > 0 && <p>추가 로딩 중...</p>}
          {!loading && videos.length === 0 && <p>결과를 찾을 수 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryPlaylist;
