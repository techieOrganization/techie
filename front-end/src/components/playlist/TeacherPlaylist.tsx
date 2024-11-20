'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import instructorData from '@/data/instructorData';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';
import '@/styles/pages/playlist/playlist.scss';
import { saveVideo } from '@/app/api/teacherAPI';
import Cookies from 'js-cookie';

const TeacherPlaylist = () => {
  const [selected, setSelected] = useState(instructorData[0]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [playlistName, setPlayListName] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]); // 선택된 비디오 ID 저장

  // 전체 강사의 동영상 가져오기
  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === '전체',
    staleTime: 1000 * 60 * 30,
  });

  // 특정 강사의 동영상을 가져오기
  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== '전체' && !!selected.channeld,
    staleTime: 1000 * 60 * 10,
  });

  const openModal = () => {
    setShowModal(true); // 모달 열기
  };

  const closeModal = () => {
    setShowModal(false); // 모달 닫기
    setPlayListName(''); // 입력 필드 초기화
    setSelectedVideoIds([]); // 선택된 비디오 ID 초기화
  };

  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  const handleVideoSelect = (videoId: string) => {
    // 비디오 ID를 선택된 비디오 ID 배열에 추가
    if (selectedVideoIds.includes(videoId)) {
      setSelectedVideoIds(selectedVideoIds.filter((id) => id !== videoId)); // 이미 선택된 경우 제거
    } else {
      setSelectedVideoIds([...selectedVideoIds, videoId]); // 새로 선택된 경우 추가
    }
  };

  const handleSaveVideo = async () => {
    const token = Cookies.get('token');
    if (selectedVideoIds.length === 0) {
      alert('선택된 비디오가 없습니다. 비디오를 선택해 주세요.');
      return; // 선택된 비디오가 없으면 함수 종료
    }

    try {
      await saveVideo(selectedVideoIds, playlistName, token); // 선택된 비디오 ID와 재생목록 이름 전송
      alert('비디오가 재생목록에 저장되었습니다.');
      closeModal(); // 저장 후 모달 닫기
    } catch (error) {
      console.error('Error saving video:', error);
      alert('비디오 저장에 실패했습니다.');
    }
  };

  const videos = selected.name === '전체' ? allQuery.data || [] : instQuery.data || [];

  return (
    <div className="playlists_container">
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name}>
            <button type="button" onClick={() => setSelected(inst)}>
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
              videos.map((video, index) => (
                <li key={index} className="video_item">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={video.thumbnails.medium.url}
                      alt={video.title}
                      width={video.thumbnails.medium.width}
                      height={video.thumbnails.medium.height}
                    />
                    <h3 className="title">{video.title}</h3>
                    <p className="channel_title">{video.channelTitle}</p>
                    <p className="date">{new Date(video.publishedAt).toLocaleDateString()}</p>
                  </a>
                  <button
                    className="button"
                    onClick={() => {
                      toggleBottomBar(index); // 하단 바 토글
                    }}
                  >
                    +
                  </button>
                  <ul className={`bar-nav ${isOpen === index ? 'isOpen' : ''}`}>
                    <li
                      onClick={() => {
                        handleVideoSelect(video.videoId); // 비디오 선택
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
              <button onClick={handleSaveVideo}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPlaylist;
