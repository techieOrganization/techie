import { FetchVideosOptions, ApiResponse } from '@/types/video';
import { devConsoleError } from '@/utils/logger';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchVideosByCategory = async ({
  category = 'ALL',
  query = '',
  page = 0,
}: FetchVideosOptions): Promise<ApiResponse> => {
  try {
    let url;

    if (query) {
      // 검색어와 카테고리가 모두 있는 경우
      url = `${baseUrl}/api/videos?query=${encodeURIComponent(query)}&category=${category}&page=${page}`;
    } else if (category.toUpperCase() === 'ALL') {
      // 전체 영상 조회
      url = `${baseUrl}/api/videos/list?page=${page}`;
    } else {
      // 카테고리별 조회
      url = `${baseUrl}/api/videos/${category}?page=${page}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      devConsoleError(`API response error: ${response.statusText}`);
      throw new Error(`Failed to fetch videos for category: ${category}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    devConsoleError('Error fetching videos:', error);
    throw error;
  }
};
