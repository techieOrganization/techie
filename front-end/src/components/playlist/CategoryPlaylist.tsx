// CategoryPlaylist.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import vidListData from '@/data/vidListData';
import { Video } from '@/types/video';
import { PlayLists } from '@/types/playlist';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import { addVideo, getVideo, saveVideo, deletepPlaylist } from '@/app/api/playlistApi';
import { formatDuration } from '@/utils/playlist/formatDuration';
import useInfiniteScroll from '@/hooks/playlist/useInfiniteScroll';
import '@/styles/pages/playlist/playlist.scss';

interface CategoryPlaylistProps {
  category: string;
}

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category: initialCategory }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectVideo, setSelectVideo] = useState<string>('');
  const [playlistNmae, setPlayListName] = useState('');
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [playlists, setPlaylists] = useState<PlayLists | undefined>(undefined);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  // 비디오 로딩 함수
  const loadVideos = useCallback(
    async (currentPage: number, currentCategory: string, currentQuery: string) => {
      setLoadingVideos(true);
      setError('');
      try {
        const data = await fetchVideosByCategory({
          category: currentCategory,
          query: currentQuery,
          page: currentPage,
        });

        setHasMore(!data.last);

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
        setLoadingVideos(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0, category, query);
  }, [category, query, loadVideos]);

  // 카테고리나 검색어가 변경되면 비디오를 새로 로드
  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0, category, query);
  }, [category, query]);

  // 페이지 번호가 변경되면 추가 비디오 로드
  useEffect(() => {
    if (page > 0) {
      loadVideos(page, category, query);
    }
  }, [page]);

  const handleCategoryClick = (newCategory: string) => {
    if (newCategory === category) return;

    setCategory(newCategory);
    router.push(`/playlists/${newCategory}`);
  };

  // 무한 스크롤 기능
  const onLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    loading: loadingVideos,
    onLoadMore,
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPlayListName('');
  };

  const handleSaveVideo = async () => {
    const token = Cookies.get('token');
    if (selectVideo.length === 0) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    try {
      await saveVideo(selectVideo, playlistNmae, token);
      alert('영상이 재생목록에 저장되었습니다.');
      closeModal();
      const data = await getVideo(token);
      setPlaylists(data); // playlists 상태 업데이트
    } catch (error) {
      console.error('Error saving video:', error);
      alert('영상 저장에 실패했습니다.');
    }
    setSelectVideo('');
  };

  const handleVideoSelect = (videoId: string) => {
    if (selectVideo.includes(videoId)) {
      setSelectVideo(selectVideo.replace(videoId, ''));
    } else {
      setSelectVideo(videoId);
    }
  };

  const token = Cookies.get('token');

  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  // 재생목록 렌더링
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPlaylists(true);
      try {
        const data = await getVideo(token);
        setPlaylists(data);
      } catch (error) {
        console.error(error); // 오류 메시지를 상태에 저장
      } finally {
        setLoadingPlaylists(false);
      }
    };

    if (token) {
      fetchData(); // 데이터 가져오기 호출
    } else {
      setLoadingPlaylists(false); // 토큰이 없으면 로딩 상태를 false로 설정
    }
  }, [token]);

  // put api로 수정해야하는 부분
  const onClickCheckBox = async (playlistId: string) => {
    const token = Cookies.get('token');
    if (selectVideo.length === 0) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    if (!token) return;
    try {
      await addVideo(playlistNmae, selectVideo, playlistId, token);
      alert('재생목록에 영상이 추가되었습니다');
    } catch (error) {
      console.log(error);
    }
    closeModal();
    setSelectVideo('');
  };
  // 재생목록 삭제
  const onClickDelete = async (playlistId: string) => {
    const token = Cookies.get('token');
    if (!token) return;
    try {
      await deletepPlaylist(playlistId, token);
      setPlaylists((prevPlaylists: PlayLists | undefined) =>
        prevPlaylists
          ? {
              playlists: prevPlaylists.playlists.filter(
                (playlist) => playlist.playlistId !== playlistId,
              ),
            }
          : undefined,
      );
      alert('재생목록이 삭제 되었습니다');
    } catch (error) {
      console.log(error);
    }
    closeModal();
    setSelectVideo('');
  };

  return (
    <div className="playlists_container">
      <ul className="dev_list">
        {vidListData.map((tab) => (
          <li key={tab.id} className={tab.id === category ? 'active' : ''}>
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
          {error && <p className="error_message">{error}</p>}
          {!error && videos.length === 0 && !loadingVideos && <p>검색 결과가 없습니다.</p>}

          {/* 비디오 리스트 */}
          <ul className="video_list">
            {videos.map((video, index) => {
              const isLastVideo = index === videos.length - 1;
              return (
                <li
                  key={video.videoId}
                  className="video_item"
                  ref={isLastVideo ? lastElementRef : null}
                >
                  <Link href={`/playlists/${category}/${video.videoId}`}>
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                    />
                    <p className="duration">{formatDuration(video.duration ?? '')}</p>
                    <h3 className="title">{video.title}</h3>
                    <p className="channel_title">{video.channelTitle}</p>
                    <p className="date">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </Link>
                  {token && (
                    <button
                      className="button"
                      onClick={() => {
                        toggleBottomBar(index);
                        handleVideoSelect(video.videoId);
                      }}
                    >
                      +
                    </button>
                  )}
                  <ul className={`bar-nav ${isOpen === index ? 'isOpen' : ''}`}>
                    <li
                      onClick={() => {
                        openModal();
                        toggleBottomBar(index);
                      }}
                    >
                      재생목록에 저장
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>

          {loadingVideos && <p>로딩 중...</p>}
        </div>
      </div>
      {/* 모달 */}
      {showModal && (
        <div
          className="overlay"
          onClick={() => {
            closeModal();
          }}
        >
          {/* 오버레이 추가 */}
          <div className="modal" onClick={closeModal}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
              사용자 재생목록
              <input
                type="text"
                value={playlistNmae}
                onChange={(e) => setPlayListName(e.target.value)}
                placeholder="재생목록 이름 입력"
                onClick={(e) => e.stopPropagation()}
              />
              <button onClick={handleSaveVideo}>재생목록 추가</button>
              <div className="playlist_content_container">
                {loadingPlaylists ? (
                  <p>재생목록을 불러오는 중입니다...</p>
                ) : playlists ? (
                  playlists.playlists.map((playlist) => (
                    <div key={playlist.playlistId} className="playlist_item">
                      <input
                        type="checkbox"
                        key={playlist.playlistId}
                        onClick={() => {
                          onClickCheckBox(playlist.playlistId);
                        }}
                      />
                      <h3>{playlist.playlistName}</h3>
                      <button
                        className="deleteBtn"
                        onClick={() => {
                          onClickDelete(playlist.playlistId);
                        }}
                        key={`delete-${playlist.playlistId}`}
                      >
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <div>재생목록이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPlaylist;
