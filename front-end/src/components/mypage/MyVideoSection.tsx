'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

  const fetchDetailPlaylist = useCallback(async (playlistId: string, userId: string) => {
    const token = Cookies.get('token');
    setIsLoading(true);
    try {
      const response = await detailPlaylist(playlistId, token, userId);
      setDetailPlaylistData(response); // 상세 재생목록 데이터를 설정
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists(); // 컴포넌트가 마운트될 때 재생목록을 가져옴
  }, [fetchPlaylists]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {playlists.playlists.length === 0 && !isLoading && <p>No playlists available.</p>}
      {playlists.playlists.map((playlist) => (
        <div key={playlist.playlistId} className="playlist-item">
          <h3>재생목록 : {playlist.playlistName}</h3>
          <p>저장된 영상 : {playlist.videoCount}</p>
          <button
            onClick={() => {
              // fetchDetailPlaylist 호출 시 playlistId와 userId 전달
              fetchDetailPlaylist(playlist.playlistId, playlist.userId);
              router.push(`my-video-list/${playlist.userId}/playlistId/${playlist.playlistId}`);
            }}
          >
            상세 영상 페이지
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyVideoSection;
