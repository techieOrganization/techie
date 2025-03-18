import apiClient from '@/components/axios/apiClient';
import { devConsoleError } from '@/utils/logger';
import axios from 'axios';
// 재생 목록 생성
export const saveVideo = async (videoId: string, name: string): Promise<void> => {
  try {
    const response = await apiClient.post(`/playlists`, {
      playlistName: name,
      videoId: videoId,
    });
    return response.data;
  } catch (error) {
    devConsoleError('Unexpected error:', error);
  }
};

// 재생 목록 받아오기

export const getVideo = async () => {
  try {
    const response = await apiClient.get(`/playlists`, {});
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생 목록에 영상 추가

export const addVideo = async (playlistName: string, selectVideo: string, playlistId: string) => {
  try {
    const response = await apiClient.put(`/playlists/${playlistId}`, {
      playlistName: playlistName,
      addVideoIds: [selectVideo],
      removeVideoIds: [],
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생 목록에 영상 삭제

export const deleteVideos = async (videoId: string, playlistId: string) => {
  try {
    const response = await apiClient.put(`/playlists/${playlistId}`, {
      playlistName: '',
      addVideoIds: [],
      removeVideoIds: [videoId],
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};

// 재생목록 삭제

export const deletePlaylist = async (playlistId: string) => {
  try {
    const response = await apiClient.delete(`/playlists/${playlistId}`, {});
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
    const response = await apiClient.get(`/playlists/${playlistId}`, {
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
