'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video } from '@/types/video';
import vidListData from '@/data/vidListData';
import { fetchVideosByCategory } from '@/app/api/videoAPI';
import '@/styles/pages/playlist/playlist.scss';
import Cookies from 'js-cookie';
import { editVideo, getVideo, saveVideo, deletepPlaylist } from '@/app/api/playlistApi';
import { PlayLists } from '@/types/playlist';

interface CategoryPlaylistProps {
  category: string;
}

const formatDuration = (duration: string | undefined): string => {
  if (!duration) return '0:00'; // duration이 없을 경우 0:00으로 표시
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1]?.replace('H', '') || '0', 10);
  const minutes = parseInt(match[2]?.replace('M', '') || '0', 10);
  const seconds = parseInt(match[3]?.replace('S', '') || '0', 10);

  const totalMinutes = hours * 60 + minutes;
  return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
};

const CategoryPlaylist: React.FC<CategoryPlaylistProps> = ({ category: initialCategory }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectVideo, setSelectVideo] = useState<string>('');
  const [playlistNmae, setPlayListName] = useState('');
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [playlists, setPlaylists] = useState<PlayLists | undefined>(undefined);

  const loadVideos = useCallback(
    async (currentPage: number) => {
      setLoading(true);
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
        console.error('Error fetching videos:', err);
        setError('비디오를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [category, query],
  );

  useEffect(() => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    loadVideos(0);
  }, [category, query, loadVideos]);

  useEffect(() => {
    if (page > 0) {
      loadVideos(page);
    }
  }, [page, loadVideos]);

  const handleCategoryClick = (newCategory: string) => {
    if (newCategory === category) return;

    setCategory(newCategory);
    router.push(`/playlists/${newCategory}`);
  };

  const lastVideoElementRef = useCallback(
    (node: HTMLLIElement | null) => {
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

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

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
  };

  const handleVideoSelect = (videoId: string) => {
    if (selectVideo.includes(videoId)) {
      setSelectVideo(selectVideo.replace(videoId, ''));
    } else {
      setSelectVideo(videoId);
    }
  };

  useEffect(() => {
    console.log(selectVideo);
  }, [selectVideo]);

  const token = Cookies.get('token');

  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchData = async () => {
      try {
        const data = await getVideo(token);
        console.log(data);
        setPlaylists(data);
      } catch (error) {
        console.error(error); // 오류 메시지를 상태에 저장
      } finally {
        setLoading(false); // 로딩 상태를 false로 설정
      }
    };

    fetchData(); // 데이터 가져오기 호출
  }, []);

  // put api로 수정해야하는 부분
  const onClickCheckBox = async (playlistId: string) => {
    const token = Cookies.get('token');
    if (selectVideo.length === 0) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    if (!token) return;
    try {
      await editVideo(playlistNmae, selectVideo, playlistId, token);
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
          {loading && page > 0 && <p>추가 로딩 중...</p>}
          {!loading && !error && videos.length === 0 && <p>결과를 찾을 수 없습니다.</p>}
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                {playlists ? (
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
