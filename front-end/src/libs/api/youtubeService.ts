import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyCvUYwoHL7TEB_VC5_YN3dUujxEgItvs58';

export const fetchVideoById = async (videoId: string) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
};

export const fetchVideosByIds = async (videoIds: string[]) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos by IDs', error);
    return [];
  }
};
