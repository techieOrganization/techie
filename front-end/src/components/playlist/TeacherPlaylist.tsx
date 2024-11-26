'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';
import '@/styles/pages/playlist/playlist.scss';
import { saveVideo } from '@/app/api/playlistApi';
import Cookies from 'js-cookie';
import instructorData from '@/data/instructorData';

const TeacherPlaylist = () => {
  const [selected, setSelected] = useState(instructorData[0]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [playlistName, setPlayListName] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const [selectedVideoIds, setSelectedVideoIds] = useState<string>(''); // 선택된 비디오 ID 저장

  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === 'ALL',
    staleTime: 1000 * 60 * 30,
  });

  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== 'ALL' && !!selected.channeld,
    staleTime: 1000 * 60 * 10,
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

  useEffect(() => {
    console.log(selectedVideoIds);
  }, [selectedVideoIds]);

  const handleSaveVideo = async () => {
    const token = Cookies.get('token');
    if (selectedVideoIds.length === 0) {
      alert('선택된 영상이 없습니다.');
      return; // 선택된 비디오가 없으면 함수 종료
    }

    try {
      await saveVideo(selectedVideoIds, playlistName, token); // 선택된 비디오 ID와 재생목록 이름 전송
      alert('영상이 재생목록에 저장되었습니다.');
      closeModal(); // 저장 후 모달 닫기
    } catch (error) {
      console.error('Error saving video:', error);
      alert('영상 저장에 실패했습니다.');
    }
  };

  const videos = selected.name === '전체' ? allQuery.data || [] : instQuery.data || [];

  const token = Cookies.get('token');

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name} className={selected.name === inst.name ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setSelected(inst)}
              disabled={selected.name === inst.name}
            >
              <Image src={inst.img} alt={inst.name} width={70} height={70} />
              <span>{inst.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="video_list_cont">
        <div className="inner">
          <ul className="video_list">
            {allQuery.isLoading || instQuery.isLoading ? (
              <p>로딩 중입니다...</p>
            ) : videos.length > 0 ? (
              videos.map((video) => (
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlayListName(e.target.value)}
                placeholder="재생목록 이름 입력"
                onClick={(e) => e.stopPropagation()}
              />
              <button onClick={handleSaveVideo}>재생목록 추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPlaylist;
