import axios from 'axios';

// 재생 목록 생성
export const saveVideo = async (
  videoIds: string[],
  name: string,
  token: string | undefined,
): Promise<void> => {
  try {
    const reponse = await axios.post(
      'http://localhost:8080/api/playlists',
      {
        name,
        videoIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('영상저장 성공');
    return reponse.data;
  } catch (error) {
    console.error('Error saving video:', error);
  }
};

// 재생 목록 받아오기

export const getVideo = async () => {
  try {
    const reponse = await axios.get('http://localhost:8080/api/playlists');
    return reponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('api 요청 오류');
  }
};
