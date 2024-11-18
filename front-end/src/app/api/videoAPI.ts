import { Video } from '@/types/video';

export const fetchVideosByCategory = async (category: string): Promise<Video[]> => {
  try {
    const url = category === 'all' ? '/api/videos?query=' : `/api/videos/${category}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch videos for category: ${category}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
