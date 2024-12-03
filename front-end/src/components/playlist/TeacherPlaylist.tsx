'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';
import '@/styles/pages/playlist/playlist.scss';
import { addVideo, deletepPlaylist, getVideo, saveVideo } from '@/app/api/playlistApi';
import Cookies from 'js-cookie';
import instructorData from '@/data/instructorData';
import { PlayLists } from '@/types/playlist';

const TeacherPlaylist = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherName = searchParams.get('teacher') || 'ALL'; // URL에서 강사 이름 읽기

  const [selected, setSelected] = useState(
    instructorData.find((inst) => inst.name === teacherName) || instructorData[0],
  );
  const [isOpen, setIsOpen] = useState<number | null>(null); // 하단 바 열림 상태
  const [playlistName, setPlayListName] = useState(''); // 재생목록 이름
  const [showModal, setShowModal] = useState(false); // 모달 열림 상태
  const [selectedVideoIds, setSelectedVideoIds] = useState<string>(''); // 선택된 비디오 ID
  const [playlists, setPlaylists] = useState<PlayLists | undefined>(undefined); // 재생목록 상태

  // 선택된 강사가 변경될 때 URL 업데이트
  const handleTeacherSelect = (inst: (typeof instructorData)[number]) => {
    setSelected(inst); // 상태 업데이트
    router.push(`/teacher-lists?teacher=${encodeURIComponent(inst.name)}`); // URL 변경
  };

  // 전체 동영상 가져오기
  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === 'ALL', // "전체" 선택 시 활성화
    staleTime: 1000 * 60 * 30, // 30분 캐싱
  });

  // 특정 강사의 동영상 가져오기
  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== 'ALL' && !!selected.channeld, // "전체"가 아닌 경우 활성화
    staleTime: 1000 * 60 * 10, // 10분 캐싱
  });

  const openModal = () => {
    setShowModal(true); // 모달 열기
  };

  const closeModal = () => {
    setShowModal(false); // 모달 닫기
    setPlayListName(''); // 입력 필드 초기화
  };

  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  const handleVideoSelect = (videoId: string) => {
    // 비디오 ID를 선택된 비디오 ID 배열에 추가
    if (selectedVideoIds.includes(videoId)) {
      setSelectedVideoIds(selectedVideoIds.replace(videoId, '')); // 이미 선택된 경우 제거
    } else {
      setSelectedVideoIds(videoId); // 새로 선택된 경우 추가
    }
  };

  useEffect(() => {}, [selectedVideoIds]);

  // 비디오를 재생목록에 저장
  const handleSaveVideo = async () => {
    const token = Cookies.get('token');
    if (selectedVideoIds.length === 0) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    try {
      await saveVideo(selectedVideoIds, playlistName, token); // 선택된 비디오 ID와 재생목록 이름 전송
      alert('영상이 재생목록에 저장되었습니다.');
      closeModal(); // 저장 후 모달 닫기
      const data = await getVideo(token);
      setPlaylists(data); // playlists 상태 업데이트
    } catch (error) {
      console.error('Error saving video:', error);
      alert('영상 저장에 실패했습니다.');
    }
    setSelectedVideoIds('');
  };

  // 페이지 로드 시 재생목록 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const data = await getVideo(token);
        setPlaylists(data);
      } catch (error) {
        console.error(error); // 오류 메시지를 상태에 저장
      }
    };

    fetchData(); // 데이터 가져오기 호출
  }, []);

  // 재생목록에 영상 추가
  const onClickCheckBox = async (playlistId: string) => {
    const token = Cookies.get('token');
    if (selectedVideoIds.length === 0) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    try {
      await addVideo(playlistName, selectedVideoIds, playlistId, token);
      alert('재생목록에 영상이 추가되었습니다');
    } catch (error) {
      console.error(error);
    }
    closeModal();
    setSelectedVideoIds('');
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
      console.error(error);
    }
    closeModal();
    setSelectedVideoIds('');
  };

  const videos = selected.name === 'ALL' ? allQuery.data || [] : instQuery.data || [];

  const token = Cookies.get('token');

  return (
    <div className="playlists_container">
      {/* 강사 리스트 */}
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name} className={selected.name === inst.name ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTeacherSelect(inst)}
              disabled={selected.name === inst.name}
            >
              <Image src={inst.img} alt={inst.name} width={70} height={70} />
              <span>{inst.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* 동영상 리스트 */}
      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {allQuery.isLoading || instQuery.isLoading ? (
              <p>로딩 중...</p>
            ) : videos.length > 0 ? (
              videos.map((video, index) => (
                <li key={video.videoId} className="video_item">
                  <Link href={`/playlists/${selected.name}/${video.videoId}`}>
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
                  {token && (
                    <button
                      className="button"
                      onClick={() => {
                        toggleBottomBar(index); // 하단 바 토글
                        handleVideoSelect(video.videoId); // 비디오 선택
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
              ))
            ) : (
              <p>동영상을 찾을 수 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
      {/* 모달 */}
      {showModal && (
        <div className="overlay" onClick={closeModal}>
          {/* 오버레이 추가 */}
          <div className="modal" onClick={closeModal}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={playlistName}
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

export default TeacherPlaylist;
