'use client';

import { detailPlaylist, deleteVideos } from '@/app/api/playlistApi';
import '@/styles/pages/my-video-list/my-video-list.scss';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
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
  const token = Cookies.get('token');

  const deleteVideo = async (videoId: string) => {
    try {
      await deleteVideos(videoId, playlistId as string, token);
      // 비디오 삭제 후 재생목록을 다시 불러옵니다.
      fetchVideo();
    } catch (error) {
      console.error('비디오 삭제 중 오류 발생:', error);
    }
  };

  const fetchVideo = useCallback(async () => {
    try {
      const response = await detailPlaylist(playlistId, token);
      setPlaylist(response);
    } catch (error) {
      console.error(error);
    }
  }, [playlistId, token]); // 의존성 배열에 playlistId와 token 추가

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

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
                <button
                  onClick={(e) => {
                    deleteVideo(video.videoId);
                    e.preventDefault();
                  }}
                  className="deleteBtn"
                >
                  ✕
                </button>
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
