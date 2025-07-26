'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Video } from '@/types/video';

interface TeacherVideoListProps {
  videos: Video[];
  isLoading: boolean;
  error: Error | null;
  selectedTeacherName: string;
  token: string | undefined;
  onOpenModal: (videoId: string) => void;
}

const TeacherVideoList: React.FC<TeacherVideoListProps> = ({
  videos,
  isLoading,
  error,
  selectedTeacherName,
  token,
  onOpenModal,
}) => {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>동영상을 불러오는 중 오류가 발생했습니다: {error.message}</p>;
  }

  if (videos.length === 0) {
    return <p>동영상을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="video_list_cont">
      <div className="inner">
        <ul className="video_list">
          {videos.map((video, index) => (
            <li key={video.videoId} className="video_item">
              <Link href={`/playlists/${encodeURIComponent(selectedTeacherName)}/${video.videoId}`}>
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
                  onClick={(e) => {
                    toggleBottomBar(index);
                    e.preventDefault();
                  }}
                >
                  +
                </button>
              )}

              <ul className={`bar-nav ${isOpen === index ? 'isOpen' : ''}`}>
                <li
                  onClick={() => {
                    onOpenModal(video.videoId);
                    toggleBottomBar(index);
                  }}
                >
                  재생목록에 저장
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherVideoList;
