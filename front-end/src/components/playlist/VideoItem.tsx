// components/VideoItem.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/types/video';
import { formatDuration } from '@/utils/playlist/formatDuration';
import Cookies from 'js-cookie';

interface VideoItemProps {
  video: Video;
  isLastVideo: boolean;
  lastElementRef: React.RefObject<HTMLLIElement>;
  index: number;
  openModal: (videoId: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isLastVideo,
  lastElementRef,
  index,
  openModal,
}) => {
  const token = Cookies.get('token');
  const [selectVideo, setSelectVideo] = useState<string>('init');
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const handleVideoSelect = (videoId: string) => {
    if (selectVideo.includes(videoId)) {
      setSelectVideo(selectVideo.replace(videoId, ''));
    } else {
      setSelectVideo(videoId);
    }
  };
  const toggleBottomBar = (index: number) => {
    setIsOpen(isOpen === index ? null : index);
  };

  return (
    <li ref={isLastVideo ? lastElementRef : null} className="video_item">
      <Link href={`/playlists/${video.category}/${video.videoId}`}>
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
          onClick={(e) => {
            toggleBottomBar(index);
            handleVideoSelect(video.videoId);
            e.preventDefault();
          }}
        >
          +
        </button>
      )}
      <ul className={`bar-nav ${isOpen === index ? 'isOpen' : ''}`}>
        <li
          onClick={() => {
            openModal(video.videoId);
          }}
        >
          재생목록에 저장
        </li>
      </ul>
    </li>
  );
};

export default VideoItem;
