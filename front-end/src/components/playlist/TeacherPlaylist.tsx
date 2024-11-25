'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import instructorData from '@/data/instructorData';
import { getAllVideos, getLatestVideos } from '@/app/api/teacherAPI';
import { Video } from '@/types/video';

interface TeacherPlaylistProps {
  channelId: string; // 강사의 채널 ID를 받는 Prop
}

const TeacherPlaylist: React.FC<TeacherPlaylistProps> = ({ channelId }) => {
  const [selected, setSelected] = useState(
    instructorData.find((inst) => inst.channeld === channelId) || instructorData[0],
  ); // 선택된 강사 상태 관리

  // React Query로 전체 강사의 동영상 가져오기
  const allQuery = useQuery<Video[], Error>({
    queryKey: ['allVideos'],
    queryFn: getAllVideos,
    enabled: selected.name === '전체', // "전체" 강사가 선택된 경우만 실행
    staleTime: 1000 * 60 * 30, // 30분 동안 데이터 캐시
  });

  // React Query로 특정 강사의 최신 동영상 가져오기
  const instQuery = useQuery<Video[], Error>({
    queryKey: ['instVideos', selected.channeld],
    queryFn: () => getLatestVideos(selected.channeld!),
    enabled: selected.name !== '전체' && !!selected.channeld, // 특정 강사가 선택된 경우 실행
    staleTime: 1000 * 60 * 10, // 10분 동안 데이터 캐시
  });

  // 선택된 강사에 따라 동영상 데이터 결정
  const videos = selected.name === '전체' ? allQuery.data || [] : instQuery.data || [];

  useEffect(() => {
    const matchedInstructor = instructorData.find((inst) => inst.channeld === channelId);
    if (matchedInstructor) {
      setSelected(matchedInstructor); // channelId에 따라 상태 초기화
    }
  }, [channelId]);

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
                </li>
              ))
            ) : (
              <p>동영상을 찾을 수 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherPlaylist;
