import React, { useEffect, useState } from 'react';
import { PlayLists } from '@/types/playlist';
import Cookies from 'js-cookie';
import { addVideo, getVideo, saveVideo } from '@/app/api/playlistApi';
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
    } catch (error) {
      console.error('Error saving video:', error);
      alert('영상 저장에 실패했습니다.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const onClickCheckBox = async (playlistId: string) => {
    const token = Cookies.get('token');
    if (!selectVideo) {
      alert('선택된 영상이 없습니다.');
      return;
    }

    if (!token) return;
    try {
      await addVideo(playlistName, selectVideo, playlistId, token);
      alert('재생목록에 영상이 추가되었습니다');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 500) {
          alert('해당 영상은 재생목록 내에 존재하는 영상입니다');
        } else {
          devConsoleError('Failed to update video in playlist', error);
        }
      }
    }

    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPlaylists(true);
      try {
        const data = await getVideo(token);
        setPlaylists(data);
      } catch (error) {
        devConsoleError('Failed to fetch playlists', error);
      } finally {
        setLoadingPlaylists(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoadingPlaylists(false);
    }
  }, [token, setPlaylists]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>사용자 재생목록</h3>
        <input
          type="text"
          value={playlistName}
          onChange={onChangePlaylistName}
          placeholder="재생목록 이름 입력"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <button onClick={handleSaveVideo} disabled={loading} className="save_button">
          {loading ? '저장 중...' : '저장하기'}
        </button>
        <div className="playlist_content_container">
          {loadingPlaylists ? (
            <p>재생목록을 불러오는 중입니다...</p>
          ) : playlists ? (
            playlists.playlists.map((playlist) => (
              <div key={playlist.playlistId} className="playlist_item">
                <input
                  type="checkbox"
                  key={playlist.playlistId}
                  onClick={() => {
                    onClickCheckBox(playlist.playlistId);
                  }}
                />
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
            ))
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
