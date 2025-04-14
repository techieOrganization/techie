// components/VideoList.tsx
import React from 'react';
import { Video } from '@/types/video';
import VideoItem from './VideoItem';

interface VideoListProps {
  videos: Video[];
  loadingVideos: boolean;
  error: string;
  lastElementRef: React.RefObject<HTMLLIElement>;
  openModal: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  loadingVideos,
  error,
  lastElementRef,
  openModal,
}) => {
  return (
    <div className="video_list_cont">
      <div className="inner">
        {error && <p className="error_message">{error}</p>}
        {!error && videos.length === 0 && !loadingVideos && <p>검색 결과가 없습니다.</p>}

        <ul className="video_list">
          {videos.map((video, index) => (
            <VideoItem
              key={video.videoId}
              video={video}
              isLastVideo={index === videos.length - 1}
              lastElementRef={lastElementRef}
              index={index}
              openModal={openModal}
            />
          ))}
        </ul>
        {loadingVideos && <p>로딩 중...</p>}
      </div>
    </div>
  );
};

export default VideoList;
