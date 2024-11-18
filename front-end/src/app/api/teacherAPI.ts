import axios from 'axios';
import instructorData from '@/data/instructorData';
import { Video } from '@/types/video';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 개별 강사의 최신 동영상 가져오기
export const fetchLatestVideosByChannel = async (channelId: string): Promise<Video[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        channelId,
        maxResults: 20,
        order: 'date',
        key: API_KEY,
      },
    });

    return response.data.items.map(
      (item: { id: { videoId: string }; snippet: Video['snippet'] }) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        videoId: item.id.videoId,
        thumbnails: item.snippet.thumbnails,
        snippet: item.snippet,
        category: 'General',
      }),
    );
  } catch (error) {
    console.error('Failed to fetch latest videos:', error);
    return [];
  }
};

// 전체 강사의 최신 동영상 가져오기
export const fetchAllPlayVids = async (): Promise<Video[]> => {
  const allVideos: Video[] = [];

  for (const instructor of instructorData) {
    if (instructor.channeld) {
      const videos = await fetchLatestVideosByChannel(instructor.channeld);
      allVideos.push(...videos);
    }
  }

  return allVideos;
};
