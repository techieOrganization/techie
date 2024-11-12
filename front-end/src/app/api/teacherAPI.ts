import axios from 'axios';

import instructorData from '@/data/instructorData';
import { Video } from '@/types/video';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 전체 강의 목록을 불러오는 함수
export const fetchAllPlaylistsVideos = async (): Promise<Video[]> => {
  const allVideos: Video[] = [];

  for (const instructor of instructorData) {
    if (instructor.playlistId) {
      const videos = await fetchPlaylistVideos(instructor.playlistId);
      allVideos.push(...videos);
    }
  }
  return allVideos;
};

// 개별 플레이리스트에서 비디오를 가져오는 함수
export const fetchPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  if (!playlistId) return [];

  try {
    const response = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults: 20,
        key: API_KEY,
      },
    });

    return response.data.items.map(
      (item: {
        snippet: Video['snippet'];
        contentDetails: { videoId: string; duration: string };
      }): Video => ({
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        videoId: item.contentDetails.videoId,
        thumbnails: item.snippet.thumbnails,
        snippet: item.snippet,
        category: 'General',
      }),
    );
  } catch (error) {
    console.error('Failed to fetch videos from playlist:', error);
    return [];
  }
};
