import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
import { devConsoleError } from '@/utils/logger';
// 재생 목록 생성
export const saveVideo = async (
  videoId: string,
  name: string,
  token: string | undefined,
): Promise<void> => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/playlists`,
      {
        playlistName: name,
        videoId: videoId,
      },
      {
        headers: {
          ContentType: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    devConsoleError('Unexpected error:', error);
  }
};

// 재생 목록 받아오기

export const getVideo = async (token: string | undefined) => {
  try {
    const response = await axios.get(`${baseUrl}/api/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생 목록에 영상 추가

export const addVideo = async (
  playlistName: string,
  selectVideo: string,
  playlistId: string,
  token: string | undefined,
) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/playlists/${playlistId}`,
      {
        playlistName: playlistName,
        addVideoIds: [selectVideo],
        removeVideoIds: [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생 목록에 영상 삭제

export const deleteVideos = async (
  videoId: string,
  playlistId: string,
  token: string | undefined,
) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/playlists/${playlistId}`,
      {
        playlistName: '',
        addVideoIds: [],
        removeVideoIds: [videoId],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생목록 삭제

export const deletepPlaylist = async (playlistId: string, token: string | undefined) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 디테일 플레이 리스트

export const detailPlaylist = async (playlistId: string | undefined, token: string | undefined) => {
  if (!playlistId || !token) return;

  try {
    const response = await axios.get(`${baseUrl}/api/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};
