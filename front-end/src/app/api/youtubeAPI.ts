import axios from 'axios';

import { devConsoleError } from '@/utils/logger';
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PL5uS0BZeM8zXcxj2pLybOFj8xMFGIjvfo';

export const fetchPlaylistVideos = async () => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=10&key=${YOUTUBE_API_KEY}`,
    );
    return response.data.items;
  } catch (error) {
    devConsoleError('Error fetching playlist videos', error);
    return [];
  }
};
