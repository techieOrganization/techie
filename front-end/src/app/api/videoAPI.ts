import { Video } from '@/types/video';

interface FetchVideosOptions {
  category?: string; // 카테고리 이름 (선택)
  query?: string; // 검색어 (선택)
}

export const fetchVideosByCategory = async ({
  category = 'all',
  query = '',
}: FetchVideosOptions): Promise<Video[]> => {
  try {
    let url;

    if (query) {
      // 검색어가 있는 경우
      url = `/api/videos?query=${encodeURIComponent(query)}`;
    } else if (category === 'all') {
      // 전체 비디오 호출
      url = '/api/videos?query=';
    } else {
      // 카테고리별 호출
      url = `/api/videos/${category}`;
    }

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
