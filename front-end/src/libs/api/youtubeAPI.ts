import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyCvUYwoHL7TEB_VC5_YN3dUujxEgItvs58';
const PLAYLIST_ID = 'PL5uS0BZeM8zXcxj2pLybOFj8xMFGIjvfo';

export const fetchPlaylistVideos = async () => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=10&key=${YOUTUBE_API_KEY}`
    );
    return response.data.items;
  } catch (error) {
    console.error('Error fetching playlist videos', error);
    return [];
  }
};
