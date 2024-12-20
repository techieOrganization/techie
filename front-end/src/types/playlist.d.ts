export interface PlayList {
  playlistId: string;
  playlistName: string;
  videoCount: number;
}
export interface PlayLists {
  playlists: PlayList[];
}

export interface DetailPlayList {
  playlistId: number;
  playlistName: string;
  videos: [
    {
      videoId: string;
      title: string;
    },
  ];
}
