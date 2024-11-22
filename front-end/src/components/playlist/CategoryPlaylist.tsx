'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import '@/styles/pages/playlist/playlist.scss';

const CategoryPlaylist: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('ALL'); // 현재 카테고리 상태
  const [page, setPage] = useState(0); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  // API 호출 함수
  const loadVideos = useCallback(async (currentCategory: string, currentPage: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchVideosByCategory({
        category: currentCategory,
        page: currentPage,
      });

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
  }, []);

  // URL로부터 초기 카테고리 설정 및 데이터 로드
  useEffect(() => {
    const initialCategory = window.location.pathname.split('/').pop() || 'ALL';
    setCategory(initialCategory);
    setPage(0); // 페이지 초기화
    setVideos([]); // 기존 데이터 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
  }, []);

  // 카테고리 또는 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadVideos(category, page);
  }, [category, page, loadVideos]);

  // 카테고리 변경 처리
  const handleCategoryClick = (newCategory: string) => {
    if (newCategory === category) return; // 현재 카테고리와 같으면 중복 실행 방지
    setCategory(newCategory);
    router.push(`/playlists/${newCategory}`);
    setPage(0); // 페이지 초기화
    setVideos([]); // 기존 데이터 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
  };

  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return; // 조건 확인
      if (observer.current) observer.current.disconnect(); // 기존 Observer 해제

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            console.log('Loading next page...'); // 디버깅 로그
            setPage((prevPage) => prevPage + 1); // 페이지 증가
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1,
        },
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <div className="playlists_container">
      {/* 카테고리 버튼 리스트 */}
      <ul className="dev_list">
        {(vidListData || []).map((tab) => (
          <li key={tab.id}>
            <button type="button" onClick={() => handleCategoryClick(tab.id)}>
              <Image src={tab.img} alt={tab.title} width={40} height={40} />
              <span>{tab.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* 동영상 리스트 */}
      <div className="video_list_cont">
        <div className="inner">
          {videos.length === 0 && loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p className="error_message">{error}</p>
          ) : (
            <ul className="video_list">
              {videos.map((video, index) => {
                const isLastVideo = index === videos.length - 1;
                return (
                  <li
                    key={index}
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
          )}
          {loading && page > 0 && <p>추가 로딩 중...</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryPlaylist;
