import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideoDetails = async (videoId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet',
        id: videoId,
        key: API_KEY,
      },
    });

    const item = response.data.items[0];
    return {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
    };
  } catch (error) {
    console.error('Failed to fetch video details:', error);
    return null;
  }
};
