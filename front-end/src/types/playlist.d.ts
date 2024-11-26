export interface PlayList {
  [playlistId: number, playlistName: string, videoCount: number];
}
export interface PlayLists {
  playlists: Playlist[];
}
