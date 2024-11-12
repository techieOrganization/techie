import { Video } from '@/types/video';

export const fetchVideosByCategory = async (category: string): Promise<Video[]> => {
  try {
    const response = await fetch(`/assets/json/videos.json`); // 실제 백엔드가 들어올 api 자리
    if (!response.ok) {
      throw new Error(`Failed to fetch videos for category: ${category}`);
    }
    const data: Video[] = await response.json();

    return category === 'all' ? data : data.filter((video) => video.category === category);
  } catch (error) {
    console.error(error);
    return [];
  }
};
