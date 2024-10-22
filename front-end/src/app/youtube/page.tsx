import React from 'react';
import YouTubeVideoList from './YouTubeVideoList';
import { fetchVideosByIds } from '@/libs/api/youtubeService';
import '@/styles/pages/youtube/youtube.scss';

const YoutubePage: React.FC = () => {
  const videoIds = ['DAxKQIG4T2Y', '-fopYsgFdzc', 'h2FDq3agImI', 'Tef1e9FiSR0', 'EzTxYQmU8OE'];

  return (
    <div>
      <div className="inner">
        <h2 className='title'>유튜브 비디오 리스트</h2>
        <YouTubeVideoList videoIds={videoIds} />
      </div>
    </div>
  );
};

export default YoutubePage;