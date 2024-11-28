package site.techieloud.backend.playlist_video.repository;


import site.techieloud.backend.playlist.domain.Playlist;
import site.techieloud.backend.playlist_video.domain.PlaylistVideo;
import site.techieloud.backend.video.domain.Video;

import java.util.List;
import java.util.Optional;

public interface PlaylistVideoRepositoryCustom {
    boolean existsByPlaylistAndVideo(Playlist playlist, Video video);
    List<Video> findVideosByPlaylist(Playlist playlist);
    Optional<PlaylistVideo> findByPlaylistAndVideo(Playlist playlist, Video video);
}