import React, { useCallback, useEffect, useState } from 'react';
import { PlayLists } from '@/types/playlist';
import Cookies from 'js-cookie';
import { addVideo, getVideo, saveVideo, deleteVideos, detailPlaylist } from '@/app/api/playlistApi';
import { devConsoleError } from '@/utils/logger';
import axios from 'axios';
import '@/styles/pages/playlist/playlist.scss';

interface ModalProps {
  playlists: PlayLists | undefined;
  setPlaylists: (playlists: PlayLists | undefined) => void;
  onClose: () => void;
  selectVideo: string | null;
  onClickDelete: (playlistId: string) => void;
}

interface PlaylistDetail {
  playlistId: string;
  playlistName: string;
  videos: { videoId: string; title: string }[];
}

const Modal: React.FC<ModalProps> = ({
  playlists,
  setPlaylists,
  onClose,
  selectVideo,
  onClickDelete,
}) => {
  const [playlistName, setPlayListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const maxLength = 15;

  const token = Cookies.get('token');

  const onChangePlaylistName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length <= maxLength) {
      setPlayListName(value);
    } else {
      alert('재생목록의 이름은 15자 이내로 작성하여야합니다');
    }
  };

  const fetchPlaylists = useCallback(async () => {
    if (!token) {
      setLoadingPlaylists(false);
      setPlaylists(undefined);
      return;
    }
    setLoadingPlaylists(true);
    try {
      const playlistsData = await getVideo(token);

      if (!playlistsData || !playlistsData.playlists || playlistsData.playlists.length === 0) {
        setPlaylists({ playlists: [] });
        setLoadingPlaylists(false);
        return;
      }

      const playlistsWithDetails = await Promise.all(
        playlistsData.playlists.map(async (playlist: { playlistId: string | undefined }) => {
          try {
            const detail: PlaylistDetail = await detailPlaylist(playlist.playlistId, token);

            return {
              ...playlist,

              videos: detail && detail.videos && Array.isArray(detail.videos) ? detail.videos : [],
            };
          } catch (detailError) {
            devConsoleError(
              `Failed to fetch detail for playlist ${playlist.playlistId}`,
              detailError,
            );

            return { ...playlist, videos: [] };
          }
        }),
      );

      setPlaylists({ ...playlistsData, playlists: playlistsWithDetails });
    } catch (error) {
      devConsoleError('Failed to fetch playlists or details', error);
      setPlaylists(undefined);
    } finally {
      setLoadingPlaylists(false);
    }
  }, [token, setPlaylists, getVideo, detailPlaylist]);

  const handleSaveVideo = async () => {
    if (!selectVideo) {
      alert('선택된 영상이 없습니다.');
      return;
    }
    if (!playlistName.trim()) {
      alert('재생목록 이름을 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      await saveVideo(selectVideo, playlistName, token);
      setPlayListName('');

      await fetchPlaylists();
    } catch (error) {
      console.log(error, '재생목록 저장 실패');
    } finally {
      setLoading(false);
    }
  };

  const onClickAddVideo = async (playlistId: string) => {
    if (!selectVideo) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      await addVideo(playlistName, selectVideo, playlistId, token);

      await fetchPlaylists();
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 500) {
          alert('해당 영상은 재생목록 내에 존재하는 영상입니다');
        } else {
          devConsoleError('Failed to add video to playlist', error);
          alert('영상 추가에 실패했습니다.');
        }
      } else {
        alert('영상 추가에 실패했습니다.');
      }
    }
  };

  const onClickDeleteVideo = async (playlistId: string) => {
    if (!selectVideo) {
      alert('선택된 영상이 없습니다.');
      return;
    }
    if (!token) {
      alert('로그인이 필요합니다');
      return;
    }
    try {
      await deleteVideos(selectVideo, playlistId, token);

      await fetchPlaylists();
    } catch (error) {
      console.error('Error deleting video from playlist:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert('영상 삭제에 실패했습니다.');
      } else {
        alert('영상 삭제에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [token, setPlaylists, selectVideo]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>사용자 재생목록</h3>

        <input
          type="text"
          value={playlistName}
          onChange={onChangePlaylistName}
          placeholder="새 재생목록 이름 입력"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />

        <button onClick={handleSaveVideo} disabled={loading} className="save_button">
          {loading ? '저장 중...' : '새 재생목록 만들기'}
        </button>

        <div className="playlist_content_container">
          {loadingPlaylists ? (
            <p>재생목록을 불러오는 중입니다...</p>
          ) : playlists && playlists.playlists ? (
            playlists.playlists.map((playlist) => {
              const isVideoInPlaylist =
                selectVideo !== null &&
                playlist.videos &&
                Array.isArray(playlist.videos) &&
                playlist.videos.some((video) => video.videoId === selectVideo);

              return (
                <div key={playlist.playlistId} className="playlist_item">
                  <button
                    onClick={() => {
                      if (isVideoInPlaylist) {
                        onClickDeleteVideo(playlist.playlistId);
                      } else {
                        onClickAddVideo(playlist.playlistId);
                      }
                    }}
                    className={isVideoInPlaylist ? 'remove-video-button' : 'add-video-button'}
                  >
                    {isVideoInPlaylist ? 'X' : '+'}
                  </button>

                  <h3>{playlist.playlistName}</h3>

                  <button
                    className="deleteBtn"
                    onClick={() => {
                      onClickDelete(playlist.playlistId);
                    }}
                    key={`delete-${playlist.playlistId}`}
                  >
                    삭제
                  </button>
                </div>
              );
            })
          ) : (
            <div>재생목록이 없습니다.</div>
          )}
        </div>
        <button onClick={onClose} className="mo-close-btn">
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
