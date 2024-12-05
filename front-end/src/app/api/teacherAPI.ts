import axios from 'axios';
import instructorData from '@/data/instructorData';
import { Video, PlaylistResponse } from '@/types/video';
import { devConsoleError } from '@/utils/logger';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 채널 ID로 uploads 플레이리스트 ID를 가져오는 함수
export const getUploadsId = async (channelId: string): Promise<string | null> => {
  try {
    const res = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: 'contentDetails',
        id: channelId,
        key: API_KEY,
      },
    });

    return res.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
  } catch (err) {
    devConsoleError('Error fetching uploads ID:', err);
    return null;
  }
};

// 플레이리스트 ID로 동영상 목록 가져오는 함수
export const getVideosFromPlaylist = async (playlistId: string): Promise<Video[]> => {
  try {
    const res = await axios.get<PlaylistResponse>(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults: 20,
        key: API_KEY,
      },
    });

    return res.data.items.map((item) => ({
      ...item,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoId: item.contentDetails.videoId,
      thumbnails: item.snippet.thumbnails,
      category: 'General',
    }));
  } catch (err) {
    devConsoleError('Error fetching videos from playlist:', err);
    return [];
  }
};

// 채널의 최신 동영상 가져오기
export const getLatestVideos = async (channelId: string): Promise<Video[]> => {
  const playlistId = await getUploadsId(channelId);
  if (!playlistId) return [];
  return getVideosFromPlaylist(playlistId);
};

// 전체 강사의 최신 동영상 가져오기
export const getAllVideos = async (): Promise<Video[]> => {
  const promises = instructorData
    .filter((inst) => inst.channeld)
    .map((inst) => getLatestVideos(inst.channeld!));

  const results = await Promise.all(promises);

  const allVideos = results.flat();

  allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allVideos;
};
