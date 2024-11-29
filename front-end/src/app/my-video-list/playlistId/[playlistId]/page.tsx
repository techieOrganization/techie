'use client';

import { detailPlaylist } from '@/app/api/playlistApi';
import '@/styles/pages/my-video-list/my-video-list.scss';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DetailPlayList } from '@/types/playlist';
import Link from 'next/link';
import Cookies from 'js-cookie';
interface Params {
  playlistId?: string;
}

const MyVideoList = () => {
  const params = useParams() as Params;
  const { playlistId } = params;

  const [playlist, setPlaylist] = useState<DetailPlayList | null>(null);

  const fetchVideo = async () => {
    const token = Cookies.get('token');
    try {
      const response = await detailPlaylist(playlistId, token);
      console.log(response);
      setPlaylist(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [playlistId, Cookies.get('token')]); // 의존성 배열에 playlistId와 userId 추가

  return (
    <div className="video_container">
      <h1 className="my-video-list-header">{playlist?.playlistName}</h1>

      <div className="video-item-container">
        {playlist && playlist.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video) => (
            <Link
              href={`/playlists/ALL/${video.videoId}`}
              className="video_title"
              key={video.videoId}
            >
              <div key={video.videoId} className="video-item">
                {video.title}
              </div>
            </Link>
          ))
        ) : (
          <p>재생목록에 영상이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyVideoList;
