// components/CategoryPlaylist.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Video } from '@/types/video';
import { PlayLists } from '@/types/playlist';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import useInfiniteScroll from '@/hooks/playlist/useInfiniteScroll';
import VideoList from './VideoList';
import Modal from './Modal';
import CategoryTabs from './CategoryTabs';
import { devConsoleError } from '@/utils/logger';
import Cookies from 'js-cookie';

import '@/styles/pages/playlist/playlist.scss';
import { deletePlaylist } from '@/app/api/playlistApi';

interface CategoryPlaylistProps {
  category: string;
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category: initialCategory }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState<PlayLists | undefined>(undefined);
  const [loadingVideos, setLoadingVideos] = useState(true);

  const [selectVideo, setSelectVideo] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const token = Cookies.get('token');
  const openModal = (videoId: string) => {
    setSelectVideo(videoId);
    setShowModal(true);
  };

  // 재생목록 삭제 함수
  const onClickDelete = async (playlistId: string) => {
    const confirmDelete = confirm('재생목록을 삭제하시겠습니까?');
    if (!confirmDelete) {
      return;
    }

    if (!token) return;

    try {
      await deletePlaylist(playlistId, token);
      setPlaylists((prevPlaylists: PlayLists | undefined) =>
        prevPlaylists
          ? {
              playlists: prevPlaylists.playlists.filter(
                (playlist) => playlist.playlistId !== playlistId,
              ),
            }
          : undefined,
      );
    } catch (error) {
      devConsoleError('Failed to delete playlist', error);
    }
  };

  // 비디오 로딩 함수
  const loadVideos = useCallback(
    async (currentPage: number) => {
      setLoadingVideos(true);
      setError('');
      try {
        const data = await fetchVideosByCategory({ category, query, page: currentPage });
        setHasMore(!data.last);
        setVideos((prevVideos) => [
          ...prevVideos,
          ...data.content.filter(
            (newVideo) => !prevVideos.some((oldVideo) => oldVideo.videoId === newVideo.videoId),
          ),
        ]);
      } catch (err) {
        devConsoleError('Error fetching videos:', err);
        setError('비디오를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoadingVideos(false);
      }
    },
    [category, query],
  );

  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0);
  }, [category, loadVideos]);

  // 페이지 번호가 변경되면 추가 비디오 로드
  useEffect(() => {
    if (page > 0) {
      loadVideos(page);
    }
  }, [page, category, query, loadVideos]);

  // 무한 스크롤 기능
  const onLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    loading: loadingVideos,
    onLoadMore,
  });

  const handleCategoryClick = (newCategory: string) => {
    if (newCategory !== category) {
      setCategory(newCategory);
      router.push(`/playlists/${newCategory}`);
    }
  };

  return (
    <div className="playlists_container">
      <CategoryTabs category={category} onCategoryClick={handleCategoryClick} />
      <VideoList
        videos={videos}
        loadingVideos={loadingVideos}
        error={error}
        lastElementRef={lastElementRef}
        openModal={openModal}
      />
      {showModal && (
        <Modal
          playlists={playlists}
          setPlaylists={setPlaylists}
          onClose={() => setShowModal(false)}
          selectVideo={selectVideo}
          onClickDelete={onClickDelete}
        />
      )}
    </div>
  );
};

export default CategoryPlaylist;