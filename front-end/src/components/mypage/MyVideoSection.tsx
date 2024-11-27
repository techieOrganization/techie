'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DetailPlayList, PlayLists } from '@/types/playlist'; // 인터페이스 임포트
import { useRouter } from 'next/navigation';
import { getVideo, detailPlaylist } from '@/app/api/playlistApi';
import Cookies from 'js-cookie';

const MyVideoSection: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlayLists>({ playlists: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [detailPlaylistData, setDetailPlaylistData] = useState<DetailPlayList>();
  const router = useRouter();

  const fetchPlaylists = useCallback(async () => {
    const token = Cookies.get('token');
    setIsLoading(true);
    try {
      const response = await getVideo(token);
      setPlaylists(response); // PlayLists 형태로 응답을 설정
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDetailPlaylist = useCallback(async (playlistId: string) => {
    const token = Cookies.get('token');
    setIsLoading(true);
    try {
      const response = await detailPlaylist(playlistId, token);
      setDetailPlaylistData(response); // 상세 재생목록 데이터를 설정
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists(); // 컴포넌트가 마운트될 때 재생목록을 가져옴
    console.log(detailPlaylistData);
  }, [fetchPlaylists]);

  return (
    <div className="playlist-container">
      {isLoading && <p>Loading...</p>}
      {playlists.playlists.length === 0 && !isLoading && <p>저장된 재생목록이 없습니다.</p>}
      {playlists.playlists.map((playlist) => (
        <div
          key={playlist.playlistId}
          className="playlist-item"
          onClick={() => {
            fetchDetailPlaylist(playlist.playlistId);
            router.push(`my-video-list/playlistId/${playlist.playlistId}`);
          }}
        >
          <h3 className="playlist-name">{playlist.playlistName}</h3>
          <p>{playlist.videoCount}</p>
        </div>
      ))}
    </div>
  );
};

export default MyVideoSection;
