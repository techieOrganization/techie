import axios from 'axios';

// 재생 목록 생성
export const saveVideo = async (
  videoId: string,
  name: string,
  token: string | undefined,
): Promise<void> => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/playlists',
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
    console.log('영상저장 성공');
    return response.data;
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// 재생 목록 받아오기

export const getVideo = async (token: string | undefined) => {
  try {
    const response = await axios.get('http://localhost:8080/api/playlists', {
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

// 재생 목록 수정하기

export const editVideo = async (
  playlistName: string,
  selectVideo: string,
  playlistId: string,
  token: string | undefined,
) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/playlists/${playlistId}`,
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

// 재생목록 삭제

export const deletepPlaylist = async (playlistId: string, token: string | undefined) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/playlists/${playlistId}`, {
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
