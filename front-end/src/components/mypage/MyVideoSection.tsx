'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DetailPlayList, PlayLists } from '@/types/playlist'; // 인터페이스 임포트
import { useRouter } from 'next/navigation';
import { getVideo, detailPlaylist, deletepPlaylist } from '@/app/api/playlistApi';
import Cookies from 'js-cookie';
import { devConsoleError } from '@/utils/logger';

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
      devConsoleError(error);
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
      devConsoleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists(); // 컴포넌트가 마운트될 때 재생목록을 가져옴
  }, [fetchPlaylists, detailPlaylistData]);

  const onClickDeleteBtn = async (playlistId: string) => {
    const confirmDelete = confirm('재생목록을 삭제하시겠습니까?');
    setIsLoading(true);
    if (!confirmDelete) {
      setIsLoading(false);
      return;
    }
    const token = Cookies.get('token');
    try {
      await deletepPlaylist(playlistId, token);
      fetchPlaylists();
    } catch (error) {
      devConsoleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="video-title">내 재생목록 모음</h2>
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
            <button
              className="delete-btn"
              onClick={(e) => {
                onClickDeleteBtn(playlist.playlistId);
                e.stopPropagation();
              }}
            >
              ✕
            </button>
            <h3 className="playlist-name">{playlist.playlistName}</h3>
            <p>{playlist.videoCount} 개의 저장된 영상</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVideoSection;
