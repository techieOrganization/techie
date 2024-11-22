'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import '@/styles/pages/playlist/playlist.scss';

interface CategoryPlaylistProps {
  category: string; // 상위 컴포넌트에서 전달받은 카테고리
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category: initialCategory }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory); // 현재 카테고리 상태
  const [page, setPage] = useState(0); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  // API 호출 함수
  const loadVideos = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchVideosByCategory({ category, page: currentPage });

        if (data.content.length === 0) {
          setHasMore(false); // 더 이상 데이터가 없음을 설정
        } else {
          setVideos((prevVideos) => [...prevVideos, ...data.content]); // 데이터 추가
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('비디오를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  // 카테고리 변경 시 초기화 및 데이터 로드
  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0);
  }, [category, loadVideos]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (page > 0) {
      loadVideos(page);
    }
  }, [page, loadVideos]);

  // 버튼 클릭으로 카테고리 변경
  const handleCategoryClick = (newCategory: string) => {
    if (newCategory === category) return; // 현재 카테고리와 같으면 실행 안 함
    setCategory(newCategory);
    router.push(`/playlists/${newCategory}`); // URL 업데이트
  };

  // IntersectionObserver를 사용한 무한 스크롤
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className="playlists_container">
      {/* 카테고리 버튼 리스트 */}
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

      {/* 동영상 리스트 */}
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
