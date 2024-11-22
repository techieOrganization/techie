import { FetchVideosOptions, ApiResponse } from '@/types/video';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchVideosByCategory = async ({
  category = 'ALL',
  query = '',
  page = 0,
}: FetchVideosOptions): Promise<ApiResponse> => {
  try {
    let url;

    if (query) {
      url = `${baseUrl}/api/videos?query=${encodeURIComponent(query)}&page=${page}`;
    } else if (category === 'ALL') {
      url = `${baseUrl}/api/videos/list?page=${page}`;
    } else {
      url = `${baseUrl}/api/videos/${category}?page=${page}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API response error: ${response.statusText}`);
      throw new Error(`Failed to fetch videos for category: ${category}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
